"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, X, Sparkles, Heart, Search, Loader2, Flower, Flower2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { useState, useEffect, useRef, useCallback } from "react"
import api from "@/lib/api"

interface SearchResult {
    id: string
    name: string
    slug: string
    price: string
    images: string[]
    category: string
}

export function Navbar() {
    const router = useRouter()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [searchOpen, setSearchOpen] = useState(false)
    const [searchQuery, setSearchQuery] = useState("")
    const [searchResults, setSearchResults] = useState<SearchResult[]>([])
    const [searchLoading, setSearchLoading] = useState(false)
    const searchRef = useRef<HTMLDivElement>(null)
    const searchInputRef = useRef<HTMLInputElement>(null)

    const items = useCartStore((s) => s.items)
    const wishlistItems = useWishlistStore((s) => s.items)
    const { user, token } = useAuthStore()

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
    const wishlistCount = wishlistItems.length

    const navLinks = [
        { href: "/products/skin-care", label: "Chăm sóc da" },
        { href: "/products/hair-care", label: "Chăm sóc tóc" },
    ]

    // Debounced search
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([])
            return
        }
        const timer = setTimeout(async () => {
            setSearchLoading(true)
            try {
                const res = await api.get("/products", { params: { search: searchQuery, limit: 5 } })
                setSearchResults(res.data.products || [])
            } catch {
                setSearchResults([])
            } finally {
                setSearchLoading(false)
            }
        }, 300)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // Focus input when search opens
    useEffect(() => {
        if (searchOpen && searchInputRef.current) {
            searchInputRef.current.focus()
        }
    }, [searchOpen])

    // Close on click outside
    useEffect(() => {
        const handleClick = (e: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
                setSearchOpen(false)
                setSearchQuery("")
            }
        }
        if (searchOpen) document.addEventListener("mousedown", handleClick)
        return () => document.removeEventListener("mousedown", handleClick)
    }, [searchOpen])

    // Close on escape
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                setSearchOpen(false)
                setSearchQuery("")
            }
        }
        document.addEventListener("keydown", handleKey)
        return () => document.removeEventListener("keydown", handleKey)
    }, [])

    const handleResultClick = (slug: string) => {
        setSearchOpen(false)
        setSearchQuery("")
        router.push(`/product/${slug}`)
    }

    return (
        <>
            <nav className="sticky top-0 left-0 right-0 z-50 navbar-luxury">
                <div className="container mx-auto px-6 lg:px-14 navbar-luxury-inner">
                    {/* Logo — left */}
                     <Link href="/" className="flex items-center gap-3 group shrink-0">
                         <img 
                             src="/logo.png" // Đường dẫn đến file logo bạn vừa tạo
                             alt="Fleur Beauty Logo" 
                            className="h-12 w-12 md:h-14 md:w-14 object-contain transition-transform duration-300 group-hover:scale-105" 
                            />
                        
                        {/* Tên thương hiệu dạng chữ */}
                        <span className="text-2xl md:text-2xl font-bold tracking-tight text-[#b8893c]">
                            Fleur
                        </span>
                    </Link>

                    {/* Right side — links + icons */}
                    <div className="hidden md:flex items-center gap-9">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className="relative text-[13px] font-medium text-[#f6efe6] hover:text-[#b8893c] transition-colors duration-300 group"
                            >
                                {link.label}
                                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#b8893c] opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100" />
                            </Link>
                        ))}

                        {/* Divider */}
                        <div className="w-px h-4 bg-[#f6efe6]/12" />

                        {/* Icons */}
                        <div className="flex items-center gap-1">
                            {/* Search */}
                            <Button
                                variant="ghost"
                                size="icon"
                                className="navbar-icon-btn"
                                onClick={() => setSearchOpen(true)}
                            >
                                <Search className="h-[18px] w-[18px]" />
                            </Button>
                            <Link href={token ? "/dashboard" : "/login"}>
                                <Button variant="ghost" size="icon" className="navbar-icon-btn">
                                    <User className="h-[18px] w-[18px]" />
                                </Button>
                            </Link>
                            <Link href="/wishlist">
                                <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                    <Heart className="h-[18px] w-[18px]" />
                                    {wishlistCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                            {wishlistCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                            <Link href="/cart">
                                <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                    <ShoppingCart className="h-[18px] w-[18px]" />
                                    {cartCount > 0 && (
                                        <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                            {cartCount}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Mobile — icons + toggle */}
                    <div className="flex md:hidden items-center gap-0.5">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="navbar-icon-btn"
                            onClick={() => setSearchOpen(true)}
                        >
                            <Search className="h-[18px] w-[18px]" />
                        </Button>
                        <Link href="/wishlist">
                            <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                <Heart className="h-[18px] w-[18px]" />
                                {wishlistCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                        {wishlistCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Link href="/cart">
                            <Button variant="ghost" size="icon" className="navbar-icon-btn relative">
                                <ShoppingCart className="h-[18px] w-[18px]" />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-[#b8893c] text-white text-[10px] font-semibold flex items-center justify-center">
                                        {cartCount}
                                    </span>
                                )}
                            </Button>
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="navbar-icon-btn"
                            onClick={() => setMobileOpen(!mobileOpen)}
                        >
                            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                        </Button>
                    </div>
                </div>
            </nav>

            {/* Search Overlay */}
            <div
                className={`fixed inset-0 z-[60] transition-all duration-300 ${searchOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { setSearchOpen(false); setSearchQuery("") }} />
                <div className="relative max-w-2xl mx-auto mt-20 px-4" ref={searchRef}>
                    <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[var(--border)]">
                        {/* Search Input */}
                        <div className="flex items-center gap-3 px-5 py-4 border-b border-[var(--border)]">
                            <Search className="h-5 w-5 text-[var(--muted-foreground)] shrink-0" />
                            <input
                                ref={searchInputRef}
                                type="text"
                                placeholder="Tìm kiếm sản phẩm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="flex-1 text-base outline-none placeholder:text-[var(--muted-foreground)] bg-transparent"
                            />
                            {searchLoading && <Loader2 className="h-4 w-4 animate-spin text-[var(--rose-gold)]" />}
                            <button
                                onClick={() => { setSearchOpen(false); setSearchQuery("") }}
                                className="text-xs text-[var(--muted-foreground)] px-2 py-1 rounded-md border border-[var(--border)] hover:bg-[var(--soft-gray)] transition-colors"
                            >
                                Thoát
                            </button>
                        </div>

                        {/* Results */}
                        {searchQuery.trim() && (
                            <div className="max-h-80 overflow-y-auto">
                                {searchResults.length > 0 ? (
                                    <div className="py-2">
                                        {searchResults.map((product) => (
                                            <button
                                                key={product.id}
                                                onClick={() => handleResultClick(product.slug)}
                                                className="w-full flex items-center gap-4 px-5 py-3 hover:bg-[var(--soft-gray)] transition-colors text-left"
                                            >
                                                <div className="w-12 h-12 rounded-xl bg-[var(--soft-gray)] border border-[var(--border)] flex items-center justify-center overflow-hidden shrink-0">
                                                    {product.images?.[0] ? (
                                                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                                                    ) : (
                                                        <Search className="h-4 w-4 text-[var(--muted-foreground)]" />
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{product.name}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)] capitalize">{product.category?.replace(/-/g, " ")}</p>
                                                </div>
                                                <span className="text-sm font-semibold text-[var(--rose-gold)] shrink-0">
                                                    ${parseFloat(product.price).toFixed(2)}
                                                </span>
                                            </button>
                                        ))}
                                    </div>
                                ) : !searchLoading ? (
                                    <div className="py-10 text-center">
                                        <p className="text-sm text-[var(--muted-foreground)]">Không tìm thấy sản phẩm &ldquo;{searchQuery}&rdquo;</p>
                                    </div>
                                ) : null}
                            </div>
                        )}

                        {/* Empty state */}
                        {!searchQuery.trim() && (
                            <div className="py-8 text-center">
                                <p className="text-sm text-[var(--muted-foreground)]">Nhập để tìm kiếm sản phẩm</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <div
                className={`fixed inset-0 z-40 md:hidden transition-all duration-300 ${mobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
            >
                <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
                <div className={`absolute top-0 right-0 h-full w-72 bg-[#1f1a17] shadow-2xl transition-transform duration-300 ${mobileOpen ? "translate-x-0" : "translate-x-full"}`}>
                    <div className="flex justify-end p-4">
                        <Button variant="ghost" size="icon" className="navbar-icon-btn" onClick={() => setMobileOpen(false)}>
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                    <div className="flex flex-col gap-1 px-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                onClick={() => setMobileOpen(false)}
                                className="px-4 py-3 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors duration-300"
                            >
                                {link.label}
                            </Link>
                        ))}
                        <div className="my-3 border-t border-white/8" />
                        <Link
                            href={token ? "/dashboard" : "/login"}
                            onClick={() => setMobileOpen(false)}
                            className="px-4 py-3 rounded-lg text-sm font-medium text-[#f6efe6] hover:bg-white/5 hover:text-[#b8893c] transition-colors duration-300"
                        >
                            {token ? "My Account" : "Sign In"}
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}
