export type Mail = {
    description: string,
    mail: string
}
export type Phone = {
    description: string,
    phone: string
}
export type Contacts = {
    mails: Mail[]
    phones: Phone[]
}
export type Position = {
    address: string
    latitude: string
    longitude: string
}
export type Sede = {
    codice_MIUR: string
    name: string
    director: string
    website: string
    descrizione: string
    tags: Array<String>
    position: Position
    contacts: Contacts
}
export type Institute = {
    id: string
    logo_url: string
    sedi: Array<Sede>
}