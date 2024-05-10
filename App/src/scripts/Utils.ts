import { Institute, OpenDay, Sede } from '../../../Data/types';
export function getMainSede(institute: Institute): Sede | null {
    const sede = institute.sedi.find(sede => sede.codice_MIUR === institute.codice_MIUR)
    if (typeof sede == "undefined") return null;

    return sede;
}

export function getOpenDays(openDays: OpenDay[], codice_MIUR: string): OpenDay[] {
    return openDays.filter(openday => openday.codice_MIUR == codice_MIUR)
}