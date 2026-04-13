"use client"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Heart, Droplets, Star } from "lucide-react"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"

interface ProductCardProps {
    id: string
    name: string
    price: number
    discountPrice?: number
    image: string
    slug: string
    stock?: number
    rating?: number
    reviews?: number
    tag?: string
}

export default function ProductCard({ id, name, price, discountPrice, image, slug, stock, rating, reviews, tag }: ProductCardProps) {
    const { token } = useAuthStore()
    const router = useRouter()
    const { toggleItem, isInWishlist } = useWishlistStore()

    // We pass string id to store
    const isSaved = isInWishlist(id)

    const handleWishlistClick = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        if (!token) {
            router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
            return
        }
        toggleItem(id)
    }

    return (
        <Card className="group overflow-hidden border border-[var(--border)] shadow-sm card-hover bg-white rounded-2xl flex flex-col h-full">
            <div className="relative aspect-[4/5] bg-[var(--soft-gray)] flex items-center justify-center overflow-hidden shrink-0">
                {/* Real product image */}
                <img
                    src={image}
                    alt={name}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    loading="lazy"
                />

                {/* Hover quick-add overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 flex items-end justify-center pb-4">
                    <Button size="sm" className="rounded-full bg-white/90 text-[#1a1a2e] text-xs font-semibold px-5 py-2 hover:bg-white shadow-lg backdrop-blur-sm transition-all duration-300 translate-y-3 group-hover:translate-y-0" asChild>
                        <Link href={`/product/${slug}`}>Xem nhanh</Link>
                    </Button>
                </div>

                {stock !== undefined && stock <= 5 && stock > 0 && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-amber-100 text-amber-700 text-xs font-semibold z-20 shadow-sm">
                        Chỉ còn {stock}
                    </span>
                )}
                {stock === 0 && (
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold z-20 shadow-sm">
                        Hết hàng
                    </span>
                )}

                {tag && (
                    <span className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold z-20 shadow-sm ${tag === 'Best Seller' ? 'bg-[#5C3D0E] text-white' :
                            tag === 'New' ? 'bg-emerald-600 text-white' :
                                tag === 'Popular' ? 'bg-[#8B6120] text-white' :
                                    'bg-[var(--rose-gold)] text-white'
                        }`}>
                        {tag}
                    </span>
                )}

                <button
                    onClick={handleWishlistClick}
                    aria-label={isSaved ? "Remove from wishlist" : "Add to wishlist"}
                    className={`absolute top-3 right-3 w-9 h-9 rounded-full backdrop-blur-md flex items-center justify-center z-20 transition-all duration-300 hover:scale-110 shadow-sm
                        ${isSaved
                            ? 'bg-white/90 text-red-500 opacity-100'
                            : 'bg-white/60 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 hover:text-[var(--rose-gold)] hover:bg-white'}
                    `}
                >
                    <Heart className="h-4 w-4" fill={isSaved ? "currentColor" : "none"} />
                </button>
            </div>

            <CardHeader className="px-3 pt-3 pb-1">
                {(rating !== undefined && reviews !== undefined) && (
                    <div className="flex items-center gap-1 mb-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`h-3 w-3 ${i <= Math.round(rating) ? 'fill-[var(--rose-gold)] text-[var(--rose-gold)]' : 'text-[var(--border)]'}`} />
                        ))}
                        <span className="text-xs text-[var(--muted-foreground)] ml-1">({reviews})</span>
                    </div>
                )}
                <CardTitle className="text-sm font-semibold line-clamp-1" title={name}>{name}</CardTitle>
            </CardHeader>
            <CardContent className="px-3 pt-0 pb-3 grow">
                <div className="flex items-baseline gap-2">
                    <p className="text-xl font-extrabold text-[var(--foreground)]">
                       {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(discountPrice || price)}
                    </p>
                    {discountPrice && (
                        <p className="text-sm text-[var(--muted-foreground)] line-through">
                          {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)}
                        </p>
                    )}
                </div>
            </CardContent>
            <CardFooter className="px-3 pb-3 pt-0 mt-auto">
                <Button variant="outline" size="sm" className="w-full rounded-full text-xs font-medium border-[var(--border)] text-[var(--foreground)] hover:bg-[var(--soft-gray)]" asChild>
                    <Link href={`/product/${slug}`}>Xem chi tiết</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}
