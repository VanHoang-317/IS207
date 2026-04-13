"use client"

import { useToastStore } from "@/store/toastStore"
import { CheckCircle2, XCircle, Info, X } from "lucide-react"
import { useEffect, useState } from "react"

const ICON_MAP = {
    success: CheckCircle2,
    error: XCircle,
    info: Info,
}

const COLOR_MAP = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
}

const ICON_COLOR_MAP = {
    success: "text-emerald-500",
    error: "text-red-500",
    info: "text-blue-500",
}

export function ToastContainer() {
    const toasts = useToastStore((s) => s.toasts)
    const removeToast = useToastStore((s) => s.removeToast)

    return (
        <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-3 pointer-events-none">
            {toasts.map((toast) => {
                const Icon = ICON_MAP[toast.type]
                return (
                    <div
                        key={toast.id}
                        className={`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg max-w-sm animate-slide-up ${COLOR_MAP[toast.type]}`}
                    >
                        <Icon className={`h-5 w-5 shrink-0 ${ICON_COLOR_MAP[toast.type]}`} />
                        <p className="text-sm font-medium flex-1">{toast.message}</p>
                        <button
                            onClick={() => removeToast(toast.id)}
                            aria-label="Dismiss notification"
                            className="shrink-0 opacity-50 hover:opacity-100 transition-opacity"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )
            })}
        </div>
    )
}
