import { GLOSARIO_TRATAMIENTOS } from '../lib/glosarioDietasTratamientos'
import {
  TRATAMIENTO_FILTRO_FARMACO,
  TRATAMIENTO_FILTRO_NO_FARMACO,
  TRATAMIENTO_FILTRO_OTROS,
} from '../lib/incidencias'
import { Field, selectClass } from './ui'

interface TratamientoFilterProps {
  value: string
  onChange: (value: string) => void
  /** En listado de tratamientos solo muestra incidencias que ya llevan tratamiento */
  listadoTratamientos?: boolean
}

export function TratamientoFilter({
  value,
  onChange,
  listadoTratamientos = false,
}: TratamientoFilterProps) {
  return (
    <Field
      label="Filtrar tratamiento"
      hint={
        listadoTratamientos
          ? 'Por tipo, categoría o texto libre en «Otros».'
          : 'Opcional. Muestra incidencias con ese tratamiento.'
      }
    >
      <select className={selectClass} value={value} onChange={(e) => onChange(e.target.value)}>
        <option value="">
          {listadoTratamientos
            ? 'Todos los que tengan tratamiento'
            : 'Todos (sin filtrar por tratamiento)'}
        </option>
        <option value={TRATAMIENTO_FILTRO_FARMACO}>Farmacológicos (todos)</option>
        <option value={TRATAMIENTO_FILTRO_NO_FARMACO}>No farmacológicos (todos)</option>
        {GLOSARIO_TRATAMIENTOS.map((grupo) => (
          <optgroup key={grupo.categoria} label={grupo.categoria}>
            {grupo.items.map((item) => (
              <option key={item.nombre} value={item.nombre}>
                {item.nombre}
              </option>
            ))}
          </optgroup>
        ))}
        <option value={TRATAMIENTO_FILTRO_OTROS}>Solo «Otros» (texto libre)</option>
      </select>
    </Field>
  )
}
