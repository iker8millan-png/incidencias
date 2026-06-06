export function normalizeEstados(estado: string | string[] | undefined): string[] {
  if (!estado) return []
  if (Array.isArray(estado)) return estado
  if (typeof estado === 'string' && estado.trim()) return [estado.trim()]
  return []
}

export function formatEstados(estado: string | string[]): string {
  return normalizeEstados(estado).join(' · ')
}
