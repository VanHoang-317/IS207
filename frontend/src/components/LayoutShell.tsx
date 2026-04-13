"use client"

import { usePathname } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { ToastContainer } from "@/components/ToastContainer"

const AUTH_ROUTES = ["/login", "/register"]

export function LayoutShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthPage = AUTH_ROUTES.includes(pathname)

    return (
        <>
            <Navbar />
            <main className="flex-1">{children}</main>
            {!isAuthPage && <Footer />}
            <ToastContainer />
        </>
    )
}
