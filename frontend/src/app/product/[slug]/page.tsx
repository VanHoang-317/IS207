"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ShoppingCart, Star, Heart, Truck, RotateCcw, ShieldCheck, ChevronRight, Home, Minus, Plus, Droplets, Check, Loader2 } from "lucide-react"
import { useCartStore } from "@/store/cartStore"
import { useWishlistStore } from "@/store/wishlistStore"
import { useAuthStore } from "@/store/authStore"
import { useToastStore } from "@/store/toastStore"
import ProductReviews from "@/components/ProductReviews"
// Thêm hàm định dạng tiền tệ vào đây
const formatVND = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

export default function ProductPage() {
    const params = useParams()
    const router = useRouter()
    const slug = params.slug as string
    const addItem = useCartStore((state) => state.addItem)

    const [product, setProduct] = useState<any>(null)
    const [reviewsData, setReviewsData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)

    const [quantity, setQuantity] = useState(1)
    const [addedToCart, setAddedToCart] = useState(false)

    const { toggleItem, isInWishlist } = useWishlistStore()
    const { token } = useAuthStore()

    const fetchProductAndReviews = async () => {
        try {
            const productRes = await api.get(`/products/${slug}`)
            const prod = productRes.data
            setProduct(prod)

            if (prod && prod.id) {
                const reviewsRes = await api.get(`/reviews/${prod.id}`)
                setReviewsData(reviewsRes.data)
            }
        } catch (err) {
            console.error("Failed to load product or reviews", err)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (slug) fetchProductAndReviews()
    }, [slug])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
                <Loader2 className="h-10 w-10 animate-spin text-[var(--rose-gold)]" />
            </div>
        )
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--background)]">
                <h1 className="text-2xl font-bold mb-4">Product not found</h1>
                <Button asChild><Link href="/">Return Home</Link></Button>
            </div>
        )
    }

    const rating = reviewsData?.averageRating || 0;
    const reviewsCount = reviewsData?.totalReviews || 0;
    const discountPrice = parseFloat(product.discount_price);
    const regularPrice = parseFloat(product.price);
    const activePrice = discountPrice && discountPrice < regularPrice ? discountPrice : regularPrice;
    const discountPercent = discountPrice && discountPrice < regularPrice ? Math.round(((regularPrice - discountPrice) / regularPrice) * 100) : 0;
    const isOutOfStock = product.stock <= 0;
    const images = product.images && product.images.length > 0 ? product.images : null;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        addItem({
            id: product.id,
            name: product.name,
            price: activePrice,
            quantity: quantity,
            slug: slug,
        })
        setAddedToCart(true)
        useToastStore.getState().addToast(`${product.name} added to cart`, 'success')
        setTimeout(() => setAddedToCart(false), 2000)
    }

    const handleBuyNow = () => {
        if (isOutOfStock) return;
        handleAddToCart()
        router.push("/checkout")
    }

    const decreaseQuantity = () => {
        if (quantity > 1) setQuantity(q => q - 1)
    }

    const increaseQuantity = () => {
        if (quantity < product.stock) setQuantity(q => q + 1)
    }

    return (
        <div className="min-h-screen bg-[var(--background)] pb-24">
            <div className="bg-[var(--soft-gray)] border-b border-[var(--border)]">
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            Home
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <Link href="/products/skin-care" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                            Products
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <span className="font-medium truncate max-w-[200px]">{product.name}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-[var(--soft-gray)] rounded-2xl overflow-hidden relative group">
                            {images ? (
                                <img
                                    src={images[selectedImage]}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <div className="w-40 h-40 rounded-full bg-white/40 flex items-center justify-center">
                                        <Droplets className="h-20 w-20 text-[var(--rose-gold)] opacity-40" />
                                    </div>
                                </div>
                            )}
                            {discountPercent > 0 && (
                                <span className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-[var(--destructive)] text-white text-xs font-bold">
                                    -{discountPercent}%
                                </span>
                            )}
                            <button
                                onClick={() => {
                                    if (!token) {
                                        router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
                                        return
                                    }
                                    const wasInWishlist = isInWishlist(product.id)
                                    toggleItem(product.id)
                                    useToastStore.getState().addToast(
                                        wasInWishlist ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
                                        wasInWishlist ? 'info' : 'success'
                                    )
                                }}
                                aria-label="Toggle wishlist"
                                className={`absolute top-4 right-4 w-10 h-10 rounded-full backdrop-blur-sm flex items-center justify-center hover:scale-110 transition-all shadow-sm
                                    ${isInWishlist(product.id) ? 'bg-white/90 text-red-500' : 'bg-white/80 text-[var(--rose-gold)] hover:bg-white'}`}
                            >
                                <Heart className="h-5 w-5" fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                            </button>
                        </div>

                        {/* Thumbnails */}
                        <div className="grid grid-cols-4 gap-3">
                            {images ? (
                                images.map((img: string, i: number) => (
                                    <div
                                        key={i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${selectedImage === i ? "border-[var(--rose-gold)]" : "border-transparent hover:border-[#c9a87c]/30"}`}
                                    >
                                        <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))
                            ) : (
                                [1, 2, 3, 4].map((i) => (
                                    <div key={i} className="aspect-square bg-[var(--soft-gray)] rounded-xl flex items-center justify-center border-2 border-transparent">
                                        <Droplets className="h-6 w-6 text-[var(--rose-gold)] opacity-30" />
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <Star key={i} className={`h-4 w-4 ${i <= Math.round(rating) ? 'fill-[var(--rose-gold)] text-[var(--rose-gold)]' : 'text-[var(--border)]'}`} />
                                    ))}
                                </div>
                                <span className="text-sm text-[var(--muted-foreground)]">{rating} ({reviewsCount} reviews)</span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{product.name}</h1>
                        </div>

                        <div className="flex items-baseline gap-3">
                            <span className="text-3xl font-bold text-[var(--rose-gold)]">{formatVND(regularPrice)}</span>
                            {discountPercent > 0 && (
                                <span className="text-lg text-[var(--muted-foreground)] line-through">{formatVND(regularPrice)}</span>
                            )}
                            {discountPercent > 0 && (
                                <span className="px-2 py-0.5 rounded-full bg-red-50 text-red-600 text-xs font-semibold">
                                    Save {discountPercent}%
                                </span>
                            )}
                        </div>

                        <p className="text-[var(--muted-foreground)] leading-relaxed">{product.description || "Premium formula designed to nourish and revitalize."}</p>

                        <div className="border-t border-[var(--border)]" />

                        <div className="space-y-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-semibold uppercase tracking-wider text-[var(--muted-foreground)]">Số lượng</span>
                                <div className="flex items-center border border-[var(--border)] rounded-full overflow-hidden">
                                    <button
                                        aria-label="Decrease quantity"
                                        onClick={decreaseQuantity}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-[var(--secondary)] transition-colors disabled:opacity-30"
                                        disabled={quantity <= 1 || isOutOfStock}
                                    >
                                        <Minus className="h-4 w-4" />
                                    </button>
                                    <span className="w-12 text-center font-semibold">{quantity}</span>
                                    <button
                                        aria-label="Increase quantity"
                                        onClick={increaseQuantity}
                                        className="w-10 h-10 flex items-center justify-center hover:bg-[var(--secondary)] transition-colors disabled:opacity-30"
                                        disabled={quantity >= product.stock || isOutOfStock}
                                    >
                                        <Plus className="h-4 w-4" />
                                    </button>
                                </div>
                                {isOutOfStock ? (
                                    <span className="text-sm text-[var(--destructive)] font-bold">Hết hàng</span>
                                ) : product.stock <= 5 ? (
                                    <span className="text-sm text-amber-600 font-bold">Chỉ còn {product.stock} sản phẩm - Đặt hàng ngay!</span>
                                ) : (
                                    <span className="text-sm text-[var(--success)] font-medium">Còn hàng</span>
                                )}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    size="lg"
                                    disabled={isOutOfStock}
                                    className={`flex-1 gap-2 text-white rounded-full py-6 text-base btn-shimmer shadow-lg transition-all duration-300 ${addedToCart ? 'bg-emerald-600 hover:bg-emerald-700' : 'gradient-primary'}`}
                                    onClick={handleAddToCart}
                                >
                                    {addedToCart ? (
                                        <><Check className="h-5 w-5" /> Đã thêm vào giỏ hàng!</>
                                    ) : isOutOfStock ? (
                                        "Out of Stock"
                                    ) : (
                                        <><ShoppingCart className="h-5 w-5" /> Thêm vào giỏ hàng</>
                                    )}
                                </Button>
                                <Button
                                    size="lg"
                                    variant="outline"
                                    disabled={isOutOfStock}
                                    className="rounded-full py-6 text-base border-black text-black hover:bg-black/5"
                                    onClick={handleBuyNow}
                                >
                                    Mua ngay
                                </Button>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2">
                            {[
                                { icon: Truck, label: "Free Shipping", sub: "Đơn hàng từ 500k" },
                                { icon: RotateCcw, label: "Đổi trả dễ dàng", sub: "Trong vòng 30 ngày." },
                                { icon: ShieldCheck, label: "Thanh toán bảo mật", sub: "Mã hóa SSL an toàn." },
                            ].map((badge) => (
                                <div key={badge.label} className="text-center p-3 rounded-xl bg-[var(--soft-gray)] border border-[var(--border)]">
                                    <badge.icon className="h-5 w-5 text-[var(--rose-gold)] mx-auto mb-1.5" />
                                    <p className="text-xs font-semibold leading-tight">{badge.label}</p>
                                    <p className="text-[10px] text-[var(--muted-foreground)] mt-0.5">{badge.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <ProductReviews
                    productId={product.id}
                    reviewsList={reviewsData?.reviews || []}
                    averageRating={rating}
                    totalReviews={reviewsCount}
                    onReviewAdded={fetchProductAndReviews}
                />
            </div>
        </div>
    )
}   