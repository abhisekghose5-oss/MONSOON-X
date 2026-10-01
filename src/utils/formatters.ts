/**
 * Specialized formatters for meteorological and geospatial observations
 */

export function formatPrecipitation(mm: number | null | undefined): string {
  if (mm === null || mm === undefined || isNaN(mm)) return '-- mm';
  return `${mm.toFixed(1)} mm`;
}

export function formatProbability(prob: number | null | undefined): string {
  if (prob === null || prob === undefined || isNaN(prob)) return '--%';
  return `${Math.round(prob)}%`;
}

export function formatTemperature(celsius: number | null | undefined): string {
  if (celsius === null || celsius === undefined || isNaN(celsius)) return '--°C';
  return `${celsius.toFixed(1)}°C`;
}

export function formatCoordinates(lat: number, lon: number): string {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lonDir = lon >= 0 ? 'E' : 'W';
  return `${Math.abs(lat).toFixed(4)}°${latDir}, ${Math.abs(lon).toFixed(4)}°${lonDir}`;
}

export function formatDateISO(dateString: string): string {
  try {
    const d = new Date(dateString);
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
}
