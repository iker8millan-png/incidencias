import { useEffect, useState } from 'react'
import { Download, Share, X } from 'lucide-react'
import { Button } from './ui'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

function isIos(): boolean {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  )
}

function isStandalone(): boolean {
  const nav = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || nav.standalone === true
}

export function PwaInstallHint() {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [dismissed, setDismissed] = useState(() =>
    localStorage.getItem('appincidencias_pwa_hint_dismissed') === '1',
  )
  const [ios] = useState(isIos)
  const [standalone] = useState(isStandalone)

  useEffect(() => {
    function onBeforeInstall(e: Event) {
      e.preventDefault()
      setDeferred(e as BeforeInstallPromptEvent)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  function dismiss() {
    localStorage.setItem('appincidencias_pwa_hint_dismissed', '1')
    setDismissed(true)
  }

  async function install() {
    if (!deferred) return
    await deferred.prompt()
    await deferred.userChoice
    setDeferred(null)
    dismiss()
  }

  if (dismissed || standalone) return null

  if (deferred) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-fade-up sm:left-auto">
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200/80 bg-white p-4 shadow-[var(--shadow-float)]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Download size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-brand-900">Instalar en el dispositivo</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              Accede como app desde la pantalla de inicio, sin abrir el navegador.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button size="sm" onClick={install}>
                Instalar
              </Button>
              <Button size="sm" variant="ghost" onClick={dismiss}>
                Ahora no
              </Button>
            </div>
          </div>
          <button
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={dismiss}
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  if (ios) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-lg animate-fade-up sm:left-auto">
        <div className="flex items-start gap-3 rounded-2xl border border-brand-200/80 bg-white p-4 shadow-[var(--shadow-float)]">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-100 text-brand-700">
            <Share size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-brand-900">Añadir a pantalla de inicio</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-500">
              Pulsa <strong>Compartir</strong> y elige <strong>Añadir a inicio</strong> para usarla
              como app.
            </p>
            <Button size="sm" variant="ghost" className="mt-3" onClick={dismiss}>
              Entendido
            </Button>
          </div>
          <button
            type="button"
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            onClick={dismiss}
            aria-label="Cerrar"
          >
            <X size={16} />
          </button>
        </div>
      </div>
    )
  }

  return null
}
