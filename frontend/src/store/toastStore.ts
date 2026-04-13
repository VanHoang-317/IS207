import { create } from 'zustand'

export type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    message: string
    type: ToastType
}

interface ToastState {
    toasts: Toast[]
    addToast: (message: string, type?: ToastType) => void
    removeToast: (id: string) => void
}

export const useToastStore = create<ToastState>()((set, get) => ({
    toasts: [],
    addToast: (message, type = 'success') => {
        const id = Date.now().toString() + Math.random().toString(36).slice(2)
        set({ toasts: [...get().toasts, { id, message, type }] })
        setTimeout(() => {
            get().removeToast(id)
        }, 3000)
    },
    removeToast: (id) => {
        set({ toasts: get().toasts.filter(t => t.id !== id) })
    },
}))
