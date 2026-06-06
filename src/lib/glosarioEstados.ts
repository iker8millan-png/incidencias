import glosarioData from '../data/glosarioEstados.json'

export interface GlosarioEstado {
  nombre: string
  significado: string
  ejemplos: string
}

export interface GlosarioEstadoGrupo {
  categoria: string
  estados: GlosarioEstado[]
}

export const GLOSARIO_ESTADOS_GRUPOS: GlosarioEstadoGrupo[] = glosarioData

export const GLOSARIO_ESTADOS: string[] = GLOSARIO_ESTADOS_GRUPOS.flatMap((g) =>
  g.estados.map((e) => e.nombre),
)

export function findEstado(nombre: string): GlosarioEstado | undefined {
  for (const grupo of GLOSARIO_ESTADOS_GRUPOS) {
    const found = grupo.estados.find((e) => e.nombre === nombre)
    if (found) return found
  }
  return undefined
}
