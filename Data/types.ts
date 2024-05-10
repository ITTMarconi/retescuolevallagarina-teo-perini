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
export enum Tag {
    Liceo = "liceo",
    Tecnico = "tecnico",
    Professionale = "professionale"
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
    tag: Tag
}

///////////////////////////////////////

export type Institute = {
    codice_MIUR: string
    sedi: Array<Sede>

    // Server loaded
    logo_url: string
    video_url: string
    openDays: OpenDays | null
}

///////////////////////////////////////

export type Orario = {
    attivita: string
    descrizione: string
    inizio_orario: Date
    fine_orario: Date
}

export type OpenDays = {
    codice_MIUR: string;
    orari: Array<Orario>;
}