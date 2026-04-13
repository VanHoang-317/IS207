"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/api"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { ChevronRight, Home, Loader2 } from "lucide-react"

const TAG_LABELS: Record<string, string> = {
    "Best Seller": "Bán chạy nhất",
    "New": "Mới nhất",
    "Popular": "Phổ biến",
    "Sale": "Khuyến mãi",
}

export default function TagPage() {
    const params = useParams()
    const tag = decodeURIComponent(params.tag as string)
    const displayName = TAG_LABELS[tag] || tag

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        api.get("/products", { params: { tag, limit: 50 } })
            .then(res => setProducts(res.data.products || []))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [tag])

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="bg-[var(--soft-gray)] border-b border-[var(--border)]">
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" /> Trang chủ
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <span className="font-medium">{displayName}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{displayName}</h1>
                    <p className="text-[var(--muted-foreground)]">Danh sách sản phẩm {displayName.toLowerCase()} từ Fleur.</p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-[var(--rose-gold)]" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-[var(--border)]">
                        <h3 className="text-lg font-semibold mb-2">Không có sản phẩm nào</h3>
                        <p className="text-[var(--muted-foreground)]">Chưa có sản phẩm nào trong danh mục này.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                price={parseFloat(product.price)}
                                discountPrice={product.discount_price ? parseFloat(product.discount_price) : undefined}
                                image={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be'}
                                slug={product.slug}
                                stock={product.stock}
                                tag={product.tag || undefined}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}