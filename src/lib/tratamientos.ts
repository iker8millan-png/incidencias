import type { FormaAdministracion, TratamientoRegistro } from '../types'
import { GLOSARIO_TRATAMIENTOS } from './glosarioDietasTratamientos'

export const FORMAS_ADMINISTRACION: { id: FormaAdministracion; label: string }[] = [
  { id: 'oral', label: 'Oral' },
  { id: 'sublingual', label: 'Sublingual' },
  { id: 'topica', label: 'Tópica' },
  { id: 'intravenosa', label: 'Intravenosa (IV)' },
  { id: 'intramuscular', label: 'Intramuscular (IM)' },
  { id: 'subcutanea', label: 'Subcutánea (SC)' },
  { id: 'inhalada', label: 'Inhalada' },
  { id: 'sonda', label: 'Sonda / SNG' },
  { id: 'no_farmacologico', label: 'No farmacológico' },
  { id: 'otra', label: 'Otra' },
]

const FARMACOLOGICOS = new Set(
  GLOSARIO_TRATAMIENTOS.find((g) => g.categoria === 'FARMACOLÓGICO')?.items.map((i) => i.nombre) ?? [],
)

const NO_FARMACOLOGICOS = new Set(
  GLOSARIO_TRATAMIENTOS.find((g) => g.categoria === 'NO FARMACOLÓGICO')?.items.map((i) => i.nombre) ??
    [],
)

export function defaultFormaForTratamiento(nombre: string): FormaAdministracion {
  if (NO_FARMACOLOGICOS.has(nombre)) return 'no_farmacologico'
  if (FARMACOLOGICOS.has(nombre)) return 'oral'
  return ''
}

export function formaAdministracionLabel(
  forma: FormaAdministracion | undefined,
  formaOtros?: string,
): string {
  if (!forma) return ''
  if (forma === 'otra') return formaOtros?.trim() ? `Otra: ${formaOtros.trim()}` : 'Otra'
  return FORMAS_ADMINISTRACION.find((f) => f.id === forma)?.label ?? forma
}

export function emptyTratamientoRegistro(nombre: string): TratamientoRegistro {
  return {
    nombre,
    hora: '',
    forma: defaultFormaForTratamiento(nombre),
    formaOtros: '',
  }
}

export function normalizeTratamientos(valor: unknown): TratamientoRegistro[] {
  if (!valor || !Array.isArray(valor)) return []
  if (valor.length === 0) return []

  if (typeof valor[0] === 'string') {
    return (valor as string[]).map((nombre) => emptyTratamientoRegistro(nombre))
  }

  return valor.map((item) => {
    const r = item as TratamientoRegistro
    return {
      nombre: r.nombre ?? '',
      hora: r.hora ?? '',
      forma: r.forma ?? defaultFormaForTratamiento(r.nombre ?? ''),
      formaOtros: r.formaOtros ?? '',
    }
  })
}

export function syncTratamientos(nombres: string[], actuales: TratamientoRegistro[]): TratamientoRegistro[] {
  return nombres.map((nombre) => {
    const prev = actuales.find((r) => r.nombre === nombre)
    return prev ?? emptyTratamientoRegistro(nombre)
  })
}

export function formatTratamientoRegistro(r: TratamientoRegistro): string {
  const forma = formaAdministracionLabel(r.forma, r.formaOtros)
  const partes = [r.nombre]
  if (r.hora) partes.push(r.hora)
  if (forma) partes.push(forma)
  return partes.join(' · ')
}

export function formatTratamientos(
  registros: TratamientoRegistro[],
  otros?: string,
  otrosHora?: string,
  otrosForma?: FormaAdministracion,
  otrosFormaOtros?: string,
): string {
  const lineas = registros.map(formatTratamientoRegistro).filter(Boolean)
  const extra = otros?.trim()
  if (extra) {
    const forma = formaAdministracionLabel(otrosForma, otrosFormaOtros)
    const partes = [`Otros: ${extra}`]
    if (otrosHora?.trim()) partes.push(otrosHora.trim())
    if (forma) partes.push(forma)
    lineas.push(partes.join(' · '))
  }
  return lineas.join(' | ')
}

export function tratamientoNombres(registros: TratamientoRegistro[]): string[] {
  return registros.map((r) => r.nombre)
}

export function esTratamientoFarmacologico(nombre: string): boolean {
  return FARMACOLOGICOS.has(nombre)
}

export function esTratamientoNoFarmacologico(nombre: string): boolean {
  return NO_FARMACOLOGICOS.has(nombre)
}
