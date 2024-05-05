export type Mail = {
    description: string,
    mail: string
}
export type Phone = {
    description: string,
    numero: string
}
export type Contacts = {
    mail: Mail[]
    phone: Phone[]
}
export type Position = {
    indirizzo: string
    latitudine: string
    longitudine: string
}
export type Sede = {
    codice_MIUR: string

    name: string
    descrizione: string

    dirigente: string
    direttore: string

    website: string
    contacts: Contacts

    posizione: Position
    tag: string
}
export type Institute = {
    codice_MIUR: string
    logo_url: string
    video_url: string
    sedi: Array<Sede>
}

export function getMainSede(institute: Institute): Sede | null {
    const sede = institute.sedi.find(sede => sede.codice_MIUR === institute.codice_MIUR)
    if(typeof sede == "undefined") return null;

    return sede;
}

///////////////////////////////////////

export type Orario = {
    attivita: string
    descrizione: string
    inizio_orario: Date
    fine_orario: Date
}

export type OpenDay = {
    sede_id: string;
    orari: Array<Orario>;
}