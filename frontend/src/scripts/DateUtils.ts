

export function getDay(orario: Date | string) {
  const date = orario instanceof Date ? orario : new Date(orario);
  const day = date.getDate();
  return day.toString().padStart(2, '0');
}

export function getMonth(orario: Date | string) {
  const date = orario instanceof Date ? orario : new Date(orario);
  const month = date.getMonth() + 1;
  return month.toString().padStart(2, '0');
}

export function getYear(orario: Date | string) {
  const date = orario instanceof Date ? orario : new Date(orario);
  return date.getFullYear().toString().substring(2, 4);
}

export function getFullYear(orario: Date | string) {
  const date = orario instanceof Date ? orario : new Date(orario);
  return date.getFullYear().toString();
}

export function getHours(orario: Date | string) {
  const date = orario instanceof Date ? orario : new Date(orario);
  const hours = date.getHours();
  return hours.toString().padStart(2, '0');
}

export function getMinutes(orario: Date | string) {
  const date = orario instanceof Date ? orario : new Date(orario);
  const minutes = date.getMinutes();
  return minutes.toString().padStart(2, '0');
}

// Helper function to format full date for display
export function formatDate(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return `${getDay(d)}/${getMonth(d)}/${getYear(d)}`;
}

// Helper function to format time for display
export function formatTime(date: Date | string): string {
  const d = date instanceof Date ? date : new Date(date);
  return `${getHours(d)}:${getMinutes(d)}`;
}
