import type { Ala, Persona } from '../types'

export const ALAS: { id: Ala; label: string }[] = [
  { id: '1', label: 'Ala 1' },
  { id: '2', label: 'Ala 2' },
]

export function alaLabel(ala: Ala): string {
  return ALAS.find((a) => a.id === ala)?.label ?? `Ala ${ala}`
}

export function inferAla(habitacion: string): Ala {
  return habitacion.trim().startsWith('2') ? '2' : '1'
}

export function normalizeAla(ala: string | undefined, habitacion: string): Ala {
  if (ala === '1' || ala === '2') return ala
  return inferAla(habitacion)
}

export function normalizePersona(persona: Persona): Persona {
  return {
    ...persona,
    ala: normalizeAla(persona.ala, persona.habitacion),
  }
}

export function formatUbicacion(ala: Ala, habitacion: string): string {
  return `${alaLabel(ala)} · Hab. ${habitacion}`
}

export function groupPersonasPorAla(personas: Persona[]): Record<Ala, Persona[]> {
  const groups: Record<Ala, Persona[]> = { '1': [], '2': [] }

  for (const persona of personas.map(normalizePersona)) {
    groups[persona.ala].push(persona)
  }

  for (const { id } of ALAS) {
    groups[id].sort((a, b) =>
      a.habitacion.localeCompare(b.habitacion, undefined, { numeric: true }),
    )
  }

  return groups
}
