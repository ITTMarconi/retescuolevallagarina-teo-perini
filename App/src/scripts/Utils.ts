import type { Institute, OpenDays, Sede } from '../../../Data/types';

export function getMainSede(institute: Institute): Sede | null {
    const sede = institute.sedi.find(sede => sede.codice_MIUR === institute.sede_principale_MIUR)
    if (typeof sede == "undefined") return null;

    return sede;
}

export function getOpenDays(openDays: OpenDays[], codice_MIUR: string): OpenDays[] {
    return openDays.filter(openday => openday.codice_MIUR == codice_MIUR)
}

export function getSedeOfOpenDay(institutes: Institute[], codice_MIUR: string): Sede | null {
    const sede = institutes.map(institute => institute.sedi).flat().find(sede => sede.codice_MIUR == codice_MIUR)
    if (typeof sede == "undefined") return null;

    return sede
}