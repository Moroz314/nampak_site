import { useState, useEffect } from 'react'

const COOKIE_STORAGE_KEY = 'nampack_cookie_consent'

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    try {
      const consent = localStorage.getItem(COOKIE_STORAGE_KEY)
      if (!consent) {
        setIsVisible(true)
      }
    } catch {
      setIsVisible(true)
    }
  }, [])

  const handleAccept = () => {
    try {
      localStorage.setItem(COOKIE_STORAGE_KEY, 'accepted')
    } catch {}
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <div
      role="region"
      aria-label="Уведомление об использовании cookie"
      className="fixed bottom-0 md:bottom-12 left-0 right-0 z-50 bg-[#162330]/95 backdrop-blur-md border-t border-slate-700 shadow-2xl py-3.5 px-4 sm:px-6 lg:px-8 transition-all duration-300 animate-fade-up"
    >
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-slate-200 font-body text-sm text-center sm:text-left leading-relaxed">
          Мы используем файлы cookie для корректной работы интернет-магазина и улучшения качества обслуживания.
        </p>
        <button
          type="button"
          onClick={handleAccept}
          className="px-6 py-2 bg-[#C59B6D] hover:bg-[#B08455] text-white font-heading font-semibold text-xs tracking-wider uppercase rounded-lg transition-colors duration-150 cursor-pointer whitespace-nowrap shadow-sm active:scale-95"
        >
          Принять
        </button>
      </div>
    </div>
  )
}
