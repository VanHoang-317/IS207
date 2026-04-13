"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import api from "@/lib/api"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const setAuth = useAuthStore((state) => state.setAuth)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await api.post("/auth/login", { email, password })
            setAuth(res.data.user, res.data.token)
            localStorage.setItem("token", res.data.token)
            router.push("/")
        } catch (err: any) {
            setError(err.response?.data?.message || "Login failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-72px)] flex">
            {/* Left — Form */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Welcome back</h1>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">Sign in to your account</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Email</label>
                            <div className="relative mt-1.5">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="pl-10 h-11 rounded-lg border-[var(--border)] bg-white focus:border-[#b8893c] focus:ring-[#b8893c]/20"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Password</label>
                                <a href="#" className="text-xs text-[#b8893c] hover:text-[#96702e] transition-colors">Forgot?</a>
                            </div>
                            <div className="relative mt-1.5">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="pl-10 pr-10 h-11 rounded-lg border-[var(--border)] bg-white focus:border-[#b8893c] focus:ring-[#b8893c]/20"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-lg bg-[#1f1a17] text-white text-sm font-medium hover:bg-[#2a2320] transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Signing in..." : "Sign In"}
                        </Button>
                    </form>

                    <p className="text-sm text-[var(--muted-foreground)] mt-6 text-center">
                        Don&apos;t have an account?{" "}
                        <Link href="/register" className="text-[#b8893c] font-medium hover:text-[#96702e] transition-colors">
                            Create one
                        </Link>
                    </p>
                </div>
            </div>

            {/* Right — Editorial photo */}
            <div className="hidden lg:block lg:w-[48%] relative">
                <img
                    src="https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=900&h=1200&fit=crop&crop=center"
                    alt="Skincare products"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                <div className="absolute bottom-12 left-10 right-10">
                    <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Glow & Co.</p>
                    <p className="text-white text-xl font-medium leading-snug max-w-xs">
                        Simple routines, visible results.
                    </p>
                </div>
            </div>
        </div>
    )
}
