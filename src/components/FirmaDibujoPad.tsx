import { useCallback, useEffect, useRef } from 'react'
import { Eraser } from 'lucide-react'
import { Button } from './ui'

interface FirmaDibujoPadProps {
  value: string
  onChange: (dataUrl: string) => void
}

function getCanvasPoint(canvas: HTMLCanvasElement, clientX: number, clientY: number) {
  const rect = canvas.getBoundingClientRect()
  const scaleX = canvas.width / rect.width
  const scaleY = canvas.height / rect.height
  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  }
}

export function FirmaDibujoPad({ value, onChange }: FirmaDibujoPadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)
  const lastPoint = useRef<{ x: number; y: number } | null>(null)
  const loadedValue = useRef<string>('')

  const syncCanvasSize = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    if (!parent) return

    const width = Math.max(parent.clientWidth, 280)
    const height = 160
    const ratio = window.devicePixelRatio || 1

    canvas.width = Math.floor(width * ratio)
    canvas.height = Math.floor(height * ratio)
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`

    const ctx = canvas.getContext('2d')
    if (!ctx) return
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 2.2
    ctx.strokeStyle = '#38092d'

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)

    if (value) {
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, width, height)
      }
      img.src = value
      loadedValue.current = value
    } else {
      loadedValue.current = ''
    }
  }, [value])

  useEffect(() => {
    syncCanvasSize()
    window.addEventListener('resize', syncCanvasSize)
    return () => window.removeEventListener('resize', syncCanvasSize)
  }, [syncCanvasSize])

  useEffect(() => {
    if (value === loadedValue.current) return
    syncCanvasSize()
  }, [value, syncCanvasSize])

  function commitStroke() {
    const canvas = canvasRef.current
    if (!canvas) return
    onChange(canvas.toDataURL('image/png'))
  }

  function startDraw(clientX: number, clientY: number) {
    const canvas = canvasRef.current
    if (!canvas) return
    drawing.current = true
    lastPoint.current = getCanvasPoint(canvas, clientX, clientY)
  }

  function drawTo(clientX: number, clientY: number) {
    if (!drawing.current) return
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    const last = lastPoint.current
    if (!canvas || !ctx || !last) return

    const point = getCanvasPoint(canvas, clientX, clientY)
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(point.x, point.y)
    ctx.stroke()
    lastPoint.current = point
  }

  function endDraw() {
    if (!drawing.current) return
    drawing.current = false
    lastPoint.current = null
    commitStroke()
  }

  function clear() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const width = canvas.width / (window.devicePixelRatio || 1)
    const height = canvas.height / (window.devicePixelRatio || 1)
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, width, height)
    loadedValue.current = ''
    onChange('')
  }

  return (
    <div className="space-y-2">
      <div className="overflow-hidden rounded-2xl border-2 border-dashed border-brand-200/80 bg-white shadow-inner">
        <canvas
          ref={canvasRef}
          className="block w-full touch-none cursor-crosshair"
          aria-label="Dibujar firma"
          onMouseDown={(e) => startDraw(e.clientX, e.clientY)}
          onMouseMove={(e) => drawTo(e.clientX, e.clientY)}
          onMouseUp={endDraw}
          onMouseLeave={endDraw}
          onTouchStart={(e) => {
            const touch = e.touches[0]
            if (!touch) return
            e.preventDefault()
            startDraw(touch.clientX, touch.clientY)
          }}
          onTouchMove={(e) => {
            const touch = e.touches[0]
            if (!touch) return
            e.preventDefault()
            drawTo(touch.clientX, touch.clientY)
          }}
          onTouchEnd={(e) => {
            e.preventDefault()
            endDraw()
          }}
        />
      </div>
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-slate-500">Firma con el ratón o el dedo en el recuadro.</p>
        <Button type="button" variant="ghost" size="sm" onClick={clear}>
          <Eraser size={14} />
          Borrar
        </Button>
      </div>
    </div>
  )
}
