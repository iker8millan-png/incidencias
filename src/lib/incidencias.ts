import type { Incidencia } from '../types'
import type { ListadoConceptoCampo } from './listadoTipos'
import {
  esTratamientoFarmacologico,
  esTratamientoNoFarmacologico,
} from './tratamientos'

export const TRATAMIENTO_FILTRO_FARMACO = '__farmacologico__'
export const TRATAMIENTO_FILTRO_NO_FARMACO = '__no_farmacologico__'
export const TRATAMIENTO_FILTRO_OTROS = '__otros__'

export function isEventoCritico(item: Incidencia): boolean {
  return item.caidaAf || item.caidaNaf || item.hospitalTras
}

export function incidenciaTieneCampo(item: Incidencia, campo: ListadoConceptoCampo): boolean {
  if (campo === 'tratamiento') {
    return item.tratamiento.length > 0 || !!item.tratamientoOtros.trim()
  }
  const lista = item[campo]
  const otro = item[`${campo}Otros` as 'dietaOtros' | 'procesoOtros']
  return lista.length > 0 || !!otro.trim()
}

export function getCampoOtros(item: Incidencia, campo: ListadoConceptoCampo): string {
  if (campo === 'tratamiento') return item.tratamientoOtros
  return item[`${campo}Otros` as 'dietaOtros' | 'procesoOtros']
}

export function filterIncidenciasPorConcepto(
  items: Incidencia[],
  campo: ListadoConceptoCampo,
  concepto: string,
): Incidencia[] {
  const conCampo = items.filter((item) => incidenciaTieneCampo(item, campo))
  if (!concepto) return conCampo
  if (concepto === TRATAMIENTO_FILTRO_OTROS) {
    return conCampo.filter((item) => getCampoOtros(item, campo).trim())
  }
  if (campo === 'tratamiento') {
    return conCampo.filter((item) => item.tratamiento.some((t) => t.nombre === concepto))
  }
  return conCampo.filter((item) => item[campo].includes(concepto))
}

export function filterIncidenciasPorTratamiento(
  items: Incidencia[],
  filtro: string,
  soloConTratamiento = false,
): Incidencia[] {
  if (!filtro) {
    return soloConTratamiento
      ? items.filter((item) => incidenciaTieneCampo(item, 'tratamiento'))
      : items
  }

  if (filtro === TRATAMIENTO_FILTRO_OTROS) {
    return items.filter((item) => item.tratamientoOtros.trim())
  }

  if (filtro === TRATAMIENTO_FILTRO_FARMACO) {
    return items.filter((item) =>
      item.tratamiento.some((t) => esTratamientoFarmacologico(t.nombre)),
    )
  }

  if (filtro === TRATAMIENTO_FILTRO_NO_FARMACO) {
    return items.filter((item) =>
      item.tratamiento.some((t) => esTratamientoNoFarmacologico(t.nombre)),
    )
  }

  return items.filter((item) => item.tratamiento.some((t) => t.nombre === filtro))
}

export function sortIncidenciasRecientes(items: Incidencia[]): Incidencia[] {
  return [...items].sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}
