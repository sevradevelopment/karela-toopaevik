import { createContext, useContext, useState, useCallback } from 'react'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null)

  const showToast = useCallback((message, type = 'success') => {
    setToast({ message, type })
    const t = setTimeout(() => setToast(null), 4000)
    return () => clearTimeout(t)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <div
          className={`toast toast-${toast.type}`}
          role="alert"
          aria-live="polite"
        >
          <span>{toast.type === 'success' ? '✓' : '!'}</span>
          <span>{toast.message}</span>
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  return ctx ? ctx : { showToast: () => {} }
}
