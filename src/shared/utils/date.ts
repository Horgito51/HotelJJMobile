export function addDays(dateStr: string, days: number): string {
  const date = parseDate(dateStr);
  date.setDate(date.getDate() + days);
  return formatDate(date);
}

export function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

export function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getDefaultDateRange(): { fechaInicio: string; fechaFin: string } {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  return {
    fechaInicio: formatDate(tomorrow),
    fechaFin: formatDate(dayAfter),
  };
}

export function toApiDateTime(dateStr: string, time: string): string {
  return `${dateStr}T${time}`;
}

export function formatDisplayDate(dateStr: string): string {
  try {
    return parseDate(dateStr).toLocaleDateString('es-EC', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function nightsBetween(fechaInicio: string, fechaFin: string): number {
  const start = parseDate(fechaInicio);
  const end = parseDate(fechaFin);
  const diff = end.getTime() - start.getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export function isValidDateRange(fechaInicio: string, fechaFin: string): boolean {
  if (!fechaInicio || !fechaFin) return false;
  return parseDate(fechaFin) > parseDate(fechaInicio);
}
