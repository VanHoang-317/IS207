"use client"

import { useState } from "react"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import api from "@/lib/api"
import { Mail, Lock, Eye, EyeOff, User } from "lucide-react"

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)
    const setAuth = useAuthStore((state) => state.setAuth)
    const router = useRouter()

    const getPasswordStrength = () => {
        if (password.length === 0) return { level: 0, label: "", color: "" }
        if (password.length < 6) return { level: 1, label: "Weak", color: "bg-red-400" }
        if (password.length < 8) return { level: 2, label: "Fair", color: "bg-amber-400" }
        const hasUpper = /[A-Z]/.test(password)
        const hasNumber = /[0-9]/.test(password)
        const hasSpecial = /[^A-Za-z0-9]/.test(password)
        const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length
        if (score >= 2 && password.length >= 8) return { level: 4, label: "Strong", color: "bg-emerald-500" }
        return { level: 3, label: "Good", color: "bg-blue-400" }
    }

    const strength = getPasswordStrength()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const res = await api.post("/auth/register", { name, email, password })
            setAuth(res.data.user, res.data.token)
            localStorage.setItem("token", res.data.token)
            router.push("/")
        } catch (err: any) {
            const data = err.response?.data
            if (data?.errors && Array.isArray(data.errors)) {
                setError(data.errors.map((e: any) => e.msg).join(". "))
            } else {
                setError(data?.message || "Registration failed")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[calc(100vh-72px)] flex">
            {/* Left — Editorial photo */}
            <div className="hidden lg:block lg:w-[48%] relative">
                <img
                    src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&h=1200&fit=crop&crop=center"
                    alt="Beauty routine"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/10" />
                <div className="absolute bottom-12 left-10 right-10">
                    <p className="text-white/70 text-xs uppercase tracking-widest mb-2">Glow & Co.</p>
                    <p className="text-white text-xl font-medium leading-snug max-w-xs">
                        Your skin tells a story. Make it a good one.
                    </p>
                </div>
            </div>

            {/* Right — Form */}
            <div className="flex-1 flex items-center justify-center px-6 lg:px-16">
                <div className="w-full max-w-sm">
                    <div className="mb-8">
                        <h1 className="text-2xl font-bold tracking-tight text-[var(--foreground)]">Create account</h1>
                        <p className="text-sm text-[var(--muted-foreground)] mt-1">Get started with Glow & Co.</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Full Name</label>
                            <div className="relative mt-1.5">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                <Input
                                    id="name"
                                    placeholder="Your name"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="pl-10 h-11 rounded-lg border-[var(--border)] bg-white focus:border-[#b8893c] focus:ring-[#b8893c]/20"
                                    required
                                />
                            </div>
                        </div>

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
                            <label htmlFor="password" className="text-xs font-medium text-[var(--muted-foreground)] uppercase tracking-wider">Password</label>
                            <div className="relative mt-1.5">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 8 characters"
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
                            {password.length > 0 && (
                                <div className="mt-2">
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4].map((i) => (
                                            <div
                                                key={i}
                                                className={`h-0.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level ? strength.color : "bg-[var(--border)]"}`}
                                            />
                                        ))}
                                    </div>
                                    <p className="text-[11px] text-[var(--muted-foreground)] mt-1">{strength.label}</p>
                                </div>
                            )}
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 rounded-lg bg-[#1f1a17] text-white text-sm font-medium hover:bg-[#2a2320] transition-colors"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create Account"}
                        </Button>
                    </form>

                    <p className="text-sm text-[var(--muted-foreground)] mt-6 text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-[#b8893c] font-medium hover:text-[#96702e] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
