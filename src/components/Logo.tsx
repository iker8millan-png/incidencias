import { COMPANY_NAME } from '../lib/constants'

type LogoProps = {
  className?: string
  /** Altura en píxeles aproximada (ancho proporcional) */
  height?: number
}

export function Logo({ className = '', height = 40 }: LogoProps) {
  return (
    <img
      src="/logo-olecer.png"
      alt={COMPANY_NAME}
      height={height}
      className={`h-auto w-auto object-contain ${className}`}
      style={{ height }}
    />
  )
}
