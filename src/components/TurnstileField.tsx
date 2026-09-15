import { useEffect, useEffectEvent, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          action: 'contact'
          callback: (token: string) => void
          'expired-callback': () => void
          'error-callback': () => void
          theme: 'light'
        },
      ) => string
      remove: (widgetId: string) => void
      reset: (widgetId: string) => void
    }
  }
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

export function TurnstileField({
  onToken,
  resetSignal = 0,
}: {
  onToken: (token: string) => void
  resetSignal?: number
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetIdRef = useRef<string | undefined>(undefined)
  const handleToken = useEffectEvent(onToken)

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetIdRef.current)
        return
      widgetIdRef.current = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        action: 'contact',
        callback: handleToken,
        'expired-callback': () => handleToken(''),
        'error-callback': () => handleToken(''),
        theme: 'light',
      })
    }

    const existingScript = document.querySelector<HTMLScriptElement>(
      'script[data-ethos-turnstile]',
    )
    const script = existingScript || document.createElement('script')

    if (!existingScript) {
      script.src =
        'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'
      script.async = true
      script.defer = true
      script.dataset.ethosTurnstile = 'true'
      document.head.appendChild(script)
    }

    if (window.turnstile) renderWidget()
    else script.addEventListener('load', renderWidget)

    return () => {
      script.removeEventListener('load', renderWidget)
      if (widgetIdRef.current && window.turnstile) {
        window.turnstile.remove(widgetIdRef.current)
        widgetIdRef.current = undefined
      }
    }
  }, [])

  useEffect(() => {
    if (!resetSignal || !widgetIdRef.current || !window.turnstile) return
    window.turnstile.reset(widgetIdRef.current)
    handleToken('')
  }, [resetSignal])

  if (!siteKey) return null
  return <div ref={containerRef} />
}
