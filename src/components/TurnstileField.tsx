import { useEffect, useEffectEvent, useRef } from 'react'

declare global {
  interface Window {
    turnstile?: {
      render: (
        element: HTMLElement,
        options: {
          sitekey: string
          callback: (token: string) => void
          'expired-callback': () => void
          theme: 'light'
        },
      ) => string
      remove: (widgetId: string) => void
    }
  }
}

const siteKey = import.meta.env.VITE_TURNSTILE_SITE_KEY

export function TurnstileField({
  onToken,
}: {
  onToken: (token: string) => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const handleToken = useEffectEvent(onToken)

  useEffect(() => {
    if (!siteKey || !containerRef.current) return

    let widgetId: string | undefined
    const renderWidget = () => {
      if (!window.turnstile || !containerRef.current || widgetId) return
      widgetId = window.turnstile.render(containerRef.current, {
        sitekey: siteKey,
        callback: handleToken,
        'expired-callback': () => handleToken(''),
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
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId)
    }
  }, [])

  if (!siteKey) return null
  return <div ref={containerRef} />
}
