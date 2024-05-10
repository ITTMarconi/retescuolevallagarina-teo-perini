export function getDay(orario: Date) {
  let out_time: string = '';
  const time: number = new Date(orario).getDate();
  if (time < 10) out_time += '0';
  out_time += time;
  return out_time;
}

export function getMonth(orario: Date) {
  let out_time: string = '';
  const time: number = new Date(orario).getMonth() + 1;
  if (time < 10) out_time += '0';
  out_time += time;
  return out_time;
}

export function getYear(orario: Date) {
  return new Date(orario).getFullYear().toString().substring(2, 4);
}

export function getHours(orario: Date) {
  let out_time: string = '';
  const time: number = new Date(orario).getHours();
  if (time < 10) out_time += '0';
  out_time += time;
  return out_time;
}

export function getMinutes(orario: Date) {
  let out_time: string = '';
  const time: number = new Date(orario).getMinutes();
  if (time < 10) out_time += '0';
  out_time += time;
  return out_time;
}

export function hasPassed(orario: Date): boolean {
  let date1 = new Date(orario).getTime();
  let now = new Date(Date.now()).getTime();

  return now > date1;
}