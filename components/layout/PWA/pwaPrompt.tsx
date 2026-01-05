'use client'

import { TabletSmartphone } from 'lucide-react'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    // Detectar se já está instalado
    const standalone = window.matchMedia('(display-mode: standalone)').matches
    setIsStandalone(standalone)

    // Capturar o evento beforeinstallprompt
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return
    }

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    
    if (outcome === 'accepted') {
      console.log('PWA instalado com sucesso')
    }

    setDeferredPrompt(null)
  }

  // Não mostrar se já estiver instalado ou se o prompt não estiver disponível
  if (isStandalone || !deferredPrompt) {
    return null
  }

  return (
    <div className="col-span-1 flex items-center justify-center mb-10 md:mb-0 md:px-8">
        <div className="w-full flex flex-col gap-4 bg-black/20 rounded-xl p-6">
            <div className="flex-1 flex items-center justify-center">
                <p className="text-lg">Instale o Euaggelion em seu dispositivo. <Link className="underline decoration-dotted" href="/p/pwa" title="Sobre o aplicativo">Saiba mais</Link></p>
            </div>

            <button
                onClick={handleInstallClick}
                className="w-full flex flex-row gap-2 justify-center items-center py-2 px-4 rounded-lg bg-accent hover:bg-accent/80 transition-colors ease-in-out"
                aria-label="Instalar aplicativo"
            >
                <TabletSmartphone className="size-4"/>
                Instalar App
            </button>
        </div>
    </div>

  )
}