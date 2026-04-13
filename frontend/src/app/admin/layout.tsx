"use client"

import { useEffect } from "react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, token, _hasHydrated } = useAuthStore()
    const router = useRouter()

    useEffect(() => {
        if (!_hasHydrated) return

        if (!token) {
            router.push("/login")
        } else if (user?.role !== "admin") {
            router.push("/")
        }
    }, [token, user, router, _hasHydrated])

    if (!_hasHydrated) return null

    if (!user || user.role !== "admin") return null

    return (
        <div className="flex min-h-screen bg-muted/40">
            <aside className="hidden w-64 flex-col border-r bg-background sm:flex">
                <div className="p-6">
                    <h2 className="text-xl font-bold">Admin Panel</h2>
                </div>
                <nav className="flex flex-col gap-2 p-4">
                    <Button variant="ghost" asChild className="justify-start">
                        <Link href="/admin">Overview</Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                        <Link href="/admin/products">Products</Link>
                    </Button>
                    <Button variant="ghost" asChild className="justify-start">
                        <Link href="/admin/orders">Orders</Link>
                    </Button>
                </nav>
            </aside>
            <main className="flex-1 p-8">
                {children}
            </main>
        </div>
    )
}