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
export type IndirizzoStudi = {
    nome: string
    link: string
}
export type Sede = {
    nome: string
    codice_MIUR: string

    responsabile_orientamento: string
    posizione: Position

    indirizzi_studi: Array<IndirizzoStudi>

    website: string
    contacts: Contacts
}

///////////////////////////////////////

export type Institute = {
    nome: string
    sede_principale_MIUR: string
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