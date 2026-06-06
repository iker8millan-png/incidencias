import { Field, inputClass } from './ui'

interface OtrosFieldProps {
  value: string
  onChange: (value: string) => void
  label?: string
  placeholder?: string
}

export function OtrosField({
  value,
  onChange,
  label = 'Otros',
  placeholder = 'Escribe aquí si no está en el listado…',
}: OtrosFieldProps) {
  return (
    <Field label={label} hint="Opcional. Para casos que no aparecen en el listado.">
      <textarea
        className={`${inputClass} min-h-16 resize-y`}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Field>
  )
}
