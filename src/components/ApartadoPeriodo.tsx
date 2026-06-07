import { Field, inputClass } from './ui'

interface ApartadoPeriodoProps {
  desde: string
  hasta: string
  onDesdeChange: (value: string) => void
  onHastaChange: (value: string) => void
}

export function ApartadoPeriodo({
  desde,
  hasta,
  onDesdeChange,
  onHastaChange,
}: ApartadoPeriodoProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field label="Desde">
        <input
          type="date"
          className={inputClass}
          value={desde}
          onChange={(e) => onDesdeChange(e.target.value)}
        />
      </Field>
      <Field label="Hasta">
        <input
          type="date"
          className={inputClass}
          value={hasta}
          onChange={(e) => onHastaChange(e.target.value)}
        />
      </Field>
    </div>
  )
}
