# PRD — Ottimizzazione query Directus, SSR e asset delivery

## Titolo
Riduzione overfetch, query inutili e asset non ottimizzati nel frontend Astro

## Contesto
L’app frontend Astro esegue diverse query Directus SSR con pattern di fetch troppo ampi (`fields: ["*", "*.*"]`), filtri applicati lato client, assenza di ordinamento/paginazione server-side e immagini servite in dimensione originale.

Questo genera:
- payload inutilmente grandi
- tempi di risposta più alti
- rischio di limiti impliciti Directus (default 100 record)
- lavoro SSR sprecato su pagine non realmente usate
- peggioramento di performance e UX, soprattutto mobile

## Problemi identificati
1. `fields: ["*", "*.*"]` ovunque — overfetch sistematico
2. Fetch ridondante in `/openday` — `ALL_OPENDAYS` non viene usata
3. Filtro `main_campus` fatto client-side invece che server-side
4. Nessun sort server-side
5. Profondità 3 in `/openday` probabilmente non necessaria
6. Nessuna paginazione — rischio troncamento a 100 elementi
7. Immagini servite a dimensione originale senza ottimizzazione
8. `/routes` disabilitata ma le query SSR vengono comunque eseguite

## Obiettivo
Ridurre il costo delle query SSR e il peso dei payload, mantenendo output e UX invariati o migliorati.

## Obiettivi misurabili
- Ridurre i campi richiesti da Directus a soli campi necessari per ogni pagina/componente
- Eliminare query non usate al 100%
- Spostare i filtri semplici su Directus (`filter`)
- Introdurre `sort` esplicito per tutte le liste
- Introdurre gestione robusta della paginazione/limite per collezioni
- Ottimizzare delivery immagini con dimensioni coerenti al contesto d’uso
- Evitare fetch SSR per route non esposte al pubblico

## Non-obiettivi
- Migrazione completa dell’architettura dati
- Refactor totale dei componenti UI
- Re-design delle pagine
- Sostituzione di Directus SDK

## Stato attuale osservato

### Pagine coinvolte
- `src/pages/openday.astro`
- `src/pages/routes.astro`
- `src/pages/istituti.astro`
- `src/pages/map.astro`
- `src/pages/calendar.astro`
- `src/pages/sede/[id].astro`

### Evidenze principali

#### 1) Overfetch diffuso
Presente in:
- `src/pages/openday.astro`
- `src/pages/routes.astro`
- `src/pages/istituti.astro`
- `src/pages/map.astro`
- `src/pages/calendar.astro`
- `src/pages/sede/[id].astro`

Pattern ricorrente:
```ts
fields: ["*", "*.*"]
```

#### 2) `/openday` fa una query inutile
In `src/pages/openday.astro`:
```ts
const ALL_OPENDAYS = await directus.request(
  readItems("events", {
    fields: ["*", "*.*"],
  })
);
```
`ALL_OPENDAYS` non viene mai usata.

#### 3) `main_campus` filtrato client-side
In `src/pages/istituti.astro`:
```ts
INSTITUTES.filter((institute) => institute.main_campus)
```
Il filtro dovrebbe essere in query.

#### 4) Nessun sort esplicito
Nessuna delle query lista usa `sort`, quindi l’ordine dipende dal backend/database.

#### 5) `/openday` richiede profondità elevata
In `src/pages/openday.astro`:
```ts
fields: ["*", "*.*", "events.school.*", "events.school.*.*"]
```
Probabilmente eccessivo rispetto a ciò che `OpenDaysList` usa davvero:
- `title`
- `description`
- `start_date`
- `end_date`
- `school` quasi non necessario se si itera già per scuola

#### 6) Nessuna paginazione o limite esplicito
Liste come:
- `schools`
- `events`
- `transport_routes`

non definiscono `limit` né strategia di paginazione. Con Directus questo può portare a risultati incompleti.

#### 7) Immagini non ottimizzate
Pattern attuale:
```tsx
<img src={`${PUBLIC_API_URL}/assets/${id}`} />
```
Trovato in:
- `src/components/SchoolListItem.astro`
- `src/components/SchoolRoutesContainer.jsx`
- `src/pages/map.astro`
- `src/pages/sede/[id].astro`

Mancano parametri di resize/fit/quality.

#### 8) `/routes` esegue SSR anche se la pagina è disabilitata
In `src/pages/routes.astro` sono presenti fetch SSR completi di:
- `schools`
- `transport_routes`

Se la route non è linkata/abilitata per utenti o deploy, il costo è inutile.

## User stories

### Come utente
voglio che le pagine carichino più velocemente,
così da consultare open day, istituti e mappe senza attese inutili.

### Come team di sviluppo
vogliamo query prevedibili, ordinate e limitate,
così da evitare regressioni di performance e inconsistenze nei dati.

### Come content/admin team
vogliamo essere sicuri che tutte le entità pubblicate siano visibili,
senza rischio di taglio silenzioso oltre 100 record.

## Requisiti funzionali

### RF1 — Sostituire wildcard fields con selettori espliciti
Ogni query `readItems/readItem` deve dichiarare solo i campi realmente necessari.

#### Esempi attesi
- `/istituti`: `id`, `name`, `main_campus`, `logo.id`, `logo.title`
- `/map`: `id`, `name`, `position`, `logo.id`, `edu_links.name`, `edu_links.link_url`
- `/calendar`: `id`, `title`, `description`, `start_date`, `end_date`, `location`, `school.id`, `school.name`, `school.short_name`
- `/openday`: school fields minimi + events minimi
- `/routes`: route fields minimi + school minimi + geometrie necessarie
- `/sede/[id]`: campi completi ma ancora espliciti, non wildcard

### RF2 — Eliminare query inutilizzate
Rimuovere `ALL_OPENDAYS` da `/openday` oppure usarla solo se necessaria a un nuovo design.

### RF3 — Portare i filtri semplici lato server
Applicare `filter` Directus per:
- `main_campus = true` in `/istituti`
- eventuali altri filtri oggi fatti client-side e deterministici

### RF4 — Aggiungere ordinamento server-side
Tutte le liste devono definire `sort`.

#### Ordinamenti suggeriti
- scuole: `sort: ["name"]`
- eventi: `sort: ["start_date"]`
- transport_routes: `sort: ["school.name", "name"]` se supportato, altrimenti fallback compatibile
- branch schools / related lists: ordinamento coerente alfabetico

### RF5 — Ridurre profondità relazionale
Le query devono evitare nested fetch non indispensabili.

#### Caso prioritario
`src/pages/openday.astro` non deve usare profondità relazionale superiore a quella richiesta da `OpenDaysList`.

### RF6 — Gestire esplicitamente limite/paginazione
Ogni query lista deve definire una strategia:
- `limit: -1` se il dataset è piccolo e deve essere completo
- oppure paginazione iterativa se il dataset può crescere sensibilmente

La scelta deve essere documentata per collezione.

### RF7 — Ottimizzare immagini Directus
Le immagini devono essere richieste con parametri coerenti al contesto:
- miniature lista scuole
- logo sidebar routes
- logo popup mappa
- hero/logo sede

#### Esempi
- lista: `?width=128&height=128&fit=contain&quality=70`
- popup marker: `?width=64&height=64&fit=contain&quality=70`
- dettaglio sede: `?width=480&fit=contain&quality=80`

### RF8 — Disattivare fetch SSR per `/routes` se pagina non attiva
Se la pagina è disabilitata:
- la route non deve fare query
- deve essere rimossa dal build pubblico, oppure
- deve short-circuitare prima del fetch

## Requisiti non funzionali

### RNF1 — Compatibilità UI
Nessun cambiamento visivo regressivo intenzionale.

### RNF2 — Prestazioni
Riduzione significativa del payload SSR per le pagine coinvolte.

### RNF3 — Manutenibilità
Ogni query deve risultare leggibile e motivata dai dati realmente usati dal componente.

### RNF4 — Prevedibilità
L’ordine dei record deve essere stabile tra deploy e ambienti.

## Soluzione proposta

### 1. Introdurre query “shape-first”
Per ogni pagina definire esplicitamente la shape dati necessaria al rendering.

### 2. Aggiungere helper centralizzati opzionali
Possibile helper in `src/lib/directus-queries.ts` per:
- field sets riusabili
- sort standard
- asset URL builder con resize params

Esempi:
- `schoolListFields`
- `schoolMapFields`
- `eventCardFields`
- `transportRouteFields`
- `buildAssetUrl(id, { width, height, fit, quality })`

### 3. Proteggere route disabilitate
Per `/routes`:
- se feature flag OFF, non eseguire fetch
- valutare rimozione link navbar/index se già non raggiungibile

### 4. Audit finale payload
Confrontare prima/dopo su:
- numero record
- campi ricevuti
- dimensione HTML/JSON
- numero totale asset bytes

## Breakdown per pagina

### `/src/pages/istituti.astro`
#### Stato attuale
- fetch scuole con `fields: ["*", "*.*"]`
- filtro `main_campus` client-side

#### Target
- query con `filter: { main_campus: { _eq: true } }`
- `sort: ["name"]`
- campi minimi: `id`, `name`, `logo.id`, `logo.title`

### `/src/pages/openday.astro`
#### Stato attuale
- fetch scuole con nested profondi
- fetch `ALL_OPENDAYS` inutilizzato

#### Target
- rimuovere query inutilizzata
- fetch sole scuole con eventi minimi necessari
- `sort` scuole per nome, eventi per data
- verificare se conviene fetchare `events` come collezione primaria e raggruppare per school

### `/src/pages/calendar.astro`
#### Stato attuale
- fetch eventi con `fields: ["*", "*.*"]`

#### Target
- campi minimi per calendario/modal:
  - `id`, `title`, `description`, `start_date`, `end_date`, `location`
  - `school.id`, `school.name`, `school.short_name`
- `sort: ["start_date"]`
- `limit` esplicito

### `/src/pages/map.astro`
#### Stato attuale
- fetch scuole con `fields: ["*", "*.*", "edu_links.*"]`
- immagini logo originali

#### Target
- campi minimi:
  - `id`, `name`, `position`
  - `logo.id`, `logo.title`
  - `edu_links.name`, `edu_links.link_url`
- immagini resized per popup/marker

### `/src/pages/routes.astro`
#### Stato attuale
- doppio fetch SSR completo
- filtraggio scuole con `routes.some(...)`
- immagini originali
- route disabilitata ma SSR presente

#### Target
- se route OFF: zero fetch
- se route ON:
  - `transport_routes` con campi minimi
  - `schools` solo se davvero necessari, oppure derivati dalle route stesse
  - sort esplicito
  - immagini sidebar ottimizzate

### `/src/pages/sede/[id].astro`
#### Stato attuale
- query singola con wildcard e nested relation
- pagina probabilmente giustifica più campi, ma non tutti

#### Target
- sostituire wildcard con campi espliciti
- includere solo relazioni usate:
  - logo
  - website_url, address, responsabile_orientamento
  - videos necessari
  - edu_links
  - branch_schools / parent_school
  - events
  - school_emails
  - school_phones

## Acceptance criteria

### AC1
Nessuna query in produzione usa più `fields: ["*", "*.*"]`.

### AC2
`src/pages/openday.astro` non contiene più fetch inutilizzati.

### AC3
`main_campus` viene filtrato lato server in `/istituti`.

### AC4
Tutte le query lista definiscono `sort` esplicito.

### AC5
Tutte le query lista definiscono `limit`/paginazione esplicita.

### AC6
Le immagini Directus nelle pagine interessate usano parametri di trasformazione.

### AC7
Se `/routes` è disabilitata, la pagina non esegue query SSR.

### AC8
Le pagine continuano a renderizzare correttamente dati e UI principali senza regressioni funzionali.

## KPI / metriche di successo
- Riduzione payload medio SSR per `/openday`, `/calendar`, `/map`, `/istituti`
- Riduzione TTFB lato server
- Riduzione transfer size immagini
- Zero casi di truncation silenzioso su liste >100 record
- Stabilità ordine elementi tra reload/deploy

## Priorità

### P0
- Rimuovere wildcard fields
- Rimuovere query inutili
- Server-side filter per `main_campus`
- Sort espliciti
- Gestione limit/paginazione
- Stop fetch SSR su `/routes` disabilitata

### P1
- Ottimizzazione immagini Directus
- Refactor helper query condivisi

### P2
- Telemetria o benchmark automatico prima/dopo
- Possibile caching/ISR strategy, se necessaria

## Rischi
- Alcuni componenti potrebbero dipendere implicitamente da campi oggi ricevuti via wildcard
- Ordinamento relazionale su Directus potrebbe richiedere fallback
- `limit: -1` va validato rispetto a cardinalità reale delle collezioni
- Riduzione eccessiva dei campi può rompere branch poco testati

## Mitigazioni
- Audit per componente dei campi effettivamente letti
- Rollout per pagina
- Confronto JSON before/after in ambiente dev
- Smoke test manuali su tutte le pagine interessate

## Piano di implementazione suggerito

### Fase 1
- `/istituti`
- `/calendar`
- `/openday`

### Fase 2
- `/map`
- `/sede/[id]`

### Fase 3
- `/routes`
- helper condivisi query/assets

## Deliverable
- Refactor query Directus nelle pagine coinvolte
- Utility per asset URL ottimizzati
- Documentazione delle field-shape per pagina
- Eventuale feature flag o rimozione completa `/routes`
