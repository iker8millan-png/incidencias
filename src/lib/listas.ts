export function normalizeLista(valor: string | string[] | undefined): string[] {
  if (!valor) return []
  if (Array.isArray(valor)) return valor
  if (typeof valor === 'string' && valor.trim()) return [valor.trim()]
  return []
}

const PROCESO_ALIASES: Record<string, string> = {
  'TIRA DE ORINA +': 'TIRA DE ORINA',
}

export function normalizeProcesoLista(valor: string | string[] | undefined): string[] {
  return normalizeLista(valor).map((nombre) => PROCESO_ALIASES[nombre] ?? nombre)
}

export function formatLista(valor: string | string[]): string {
  return normalizeLista(valor).join(' · ')
}

export function formatListaConOtros(lista: string | string[], otro: string | undefined): string {
  const parts = normalizeLista(lista)
  const extra = otro?.trim()
  if (extra) parts.push(`Otros: ${extra}`)
  return parts.join(' · ')
}
