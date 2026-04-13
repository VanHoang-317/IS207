"use client"

import { useEffect, useState } from "react"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import { Heart, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function WishlistPage() {
    const { token } = useAuthStore()
    const router = useRouter()
    const { fetchWishlist, items: wishlistIds } = useWishlistStore()

    const [savedProducts, setSavedProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            router.push("/login?redirect=/wishlist")
            return
        }

        const loadWishlistAndData = async () => {
            setLoading(true)
            await fetchWishlist() // Update global ID list
            try {
                // Fetch the full product objects for the saved items
                const res = await api.get('/wishlist')
                setSavedProducts(res.data)
            } catch (error) {
                console.error("Failed to load wishlist products", error)
            } finally {
                setLoading(false)
            }
        }

        loadWishlistAndData()
    }, [token, fetchWishlist, router])

    // Filter out products that were optimistically removed from the store
    const displayProducts = savedProducts.filter(p => wishlistIds.includes(p.id))

    if (loading) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[var(--rose-gold)]" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            {/* Header Section */}
            <div className="bg-white border-b border-[var(--border)] pt-8 pb-12 mb-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--blush)] blur-[100px] rounded-full opacity-50 pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-amber-50 blur-[100px] rounded-full opacity-50 pointer-events-none" />

                <div className="container mx-auto px-4 lg:px-8 relative z-10">
                    <div className="flex items-center gap-3 text-[var(--rose-gold)] mb-4">
                        <Sparkles className="h-5 w-5" />
                        <span className="text-sm font-semibold tracking-wider uppercase">Bộ sưu tập của bạn</span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-playfair font-bold text-[var(--foreground)] mb-4">
                       Danh sách yêu thích
                    </h1>
                    <p className="text-[var(--muted-foreground)] max-w-lg text-lg">
                        Lưu giữ những sản phẩm rạng ngời mà bạn đang nâng niu.
                    </p>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 pb-16">
                {displayProducts.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-[var(--border)] animate-fade-in-up">
                        <div className="w-20 h-20 rounded-full bg-[var(--blush)] flex items-center justify-center mx-auto mb-6">
                            <Heart className="h-8 w-8 text-[var(--rose-gold)]" strokeWidth={1.5} />
                        </div>
                        <h2 className="text-2xl font-bold mb-3 font-playfair">Danh sách hiện đang trống</h2>
                        <p className="text-[var(--muted-foreground)] mb-8 max-w-sm mx-auto">
                            Hãy bắt đầu xây dựng quy trình chăm sóc da mơ ước bằng cách lưu lại những sản phẩm bạn yêu thích.
                        </p>
                        <Button className="rounded-full gradient-primary text-white py-6 px-8 text-base btn-shimmer" asChild>
                            <Link href="/products/skin-care">Khám phá ngay</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                        {displayProducts.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={parseFloat(product.price)}
                                discountPrice={product.discount_price ? parseFloat(product.discount_price) : undefined}
                                image={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&q=80'}
                                slug={product.slug}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
