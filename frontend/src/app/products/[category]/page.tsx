"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import ProductCard from "@/components/ProductCard"
import Link from "next/link"
import { Star, Heart, SlidersHorizontal, ChevronRight, Droplets, Home, Loader2 } from "lucide-react"
const CATEGORY_LABELS: Record<string, string> = {
    "skin-care": "Chăm sóc da",
    "hair-care": "Chăm sóc tóc",
}
export default function CategoryPage() {
    const params = useParams()
    const category = params.category as string
    const displayName = CATEGORY_LABELS[category] || category?.replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase()) || ""

    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [sort, setSort] = useState("newest")
    const [minPrice, setMinPrice] = useState<number | undefined>()
    const [maxPrice, setMaxPrice] = useState<number | undefined>()

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true)
            try {
                const res = await api.get("/products", {
                    params: {
                       category: category,
                        sort: sort,
                        minPrice: minPrice,
                        maxPrice: maxPrice
                    }
                })
                setProducts(res.data.products || [])
            } catch (err) {
                console.error("Failed to fetch products:", err)
            } finally {
                setLoading(false)
            }
        }

        if (category) {
            fetchProducts()
        }
    }, [category, sort, minPrice, maxPrice])

    const handlePriceFilter = (min?: number, max?: number) => {
        if (String(minPrice) === String(min) && String(maxPrice) === String(max)) {
            setMinPrice(undefined)
            setMaxPrice(undefined)
        } else {
            setMinPrice(min)
            setMaxPrice(max)
        }
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="bg-[var(--soft-gray)] border-b border-[var(--border)]">
                <div className="container mx-auto px-4 lg:px-8 py-3">
                    <nav className="flex items-center gap-2 text-sm">
                        <Link href="/" className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors flex items-center gap-1">
                            <Home className="h-3.5 w-3.5" />
                            Trang chủ
                        </Link>
                        <ChevronRight className="h-3.5 w-3.5 text-[var(--muted-foreground)]" />
                        <span className="font-medium">{displayName}</span>
                    </nav>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <div className="mb-10">
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">{displayName}</h1>
                    <p className="text-[var(--muted-foreground)]">Đánh thức vẻ đẹp tự nhiên với dòng sản phẩm {displayName.toLowerCase()} tuyển chọn từ Fleur.</p>
                </div>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    <aside className="w-full lg:w-64 shrink-0">
                        <div className="lg:sticky lg:top-24 space-y-6">
                            <div className="flex items-center gap-2 text-lg font-semibold mb-4">
                                <SlidersHorizontal className="h-5 w-5 text-[var(--rose-gold)]" />
                                Bộ lọc
                            </div>

                            <div className="bg-white rounded-xl p-4 border border-[var(--border)] space-y-3">
                                <h3 className="font-semibold text-sm uppercase tracking-wider text-[var(--muted-foreground)]">Mức giá</h3>
                                <div className="space-y-2.5">
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={minPrice === undefined && maxPrice === 500000} onChange={() => handlePriceFilter(undefined,500000)} className="w-4 h-4 rounded border-[var(--border)] text-[var(--rose-gold)] focus:ring-[var(--rose-gold)] accent-[var(--rose-gold)]" />
                                        <span className="text-sm group-hover:text-[var(--foreground)] text-[var(--muted-foreground)] transition-colors">Dưới 500.000</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={minPrice === 500001 && maxPrice === 1000000} onChange={() => handlePriceFilter(500001, 1000000)} className="w-4 h-4 rounded border-[var(--border)] text-[var(--rose-gold)] focus:ring-[var(--rose-gold)] accent-[var(--rose-gold)]" />
                                        <span className="text-sm group-hover:text-[var(--foreground)] text-[var(--muted-foreground)] transition-colors">500.000-1.000.000</span>
                                    </label>
                                    <label className="flex items-center gap-3 cursor-pointer group">
                                        <input type="checkbox" checked={minPrice === 1000001 && maxPrice === undefined} onChange={() => handlePriceFilter(1000001,undefined)} className="w-4 h-4 rounded border-[var(--border)] text-[var(--rose-gold)] focus:ring-[var(--rose-gold)] accent-[var(--rose-gold)]" />
                                        <span className="text-sm group-hover:text-[var(--foreground)] text-[var(--muted-foreground)] transition-colors">1.000.000+</span>
                                    </label>
                                </div>  
                            </div>
                        </div>
                    </aside>

                    <div className="flex-1">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 bg-white rounded-xl px-4 py-3 border border-[var(--border)] gap-4">
                            <span className="text-sm text-[var(--muted-foreground)]">{products.length} sản phẩm</span>
                            <select
                                aria-label="Sort products"
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                                className="text-sm border border-[var(--border)] rounded-lg px-3 py-1.5 bg-transparent focus:outline-none focus:border-[var(--rose-gold)] cursor-pointer"
                            >
                                <option value="newest">Mới nhất</option>
                                <option value="price_asc">Giá: Thấp tới cao</option>
                                <option value="price_desc">Giá: Cao tới thấp</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="flex justify-center items-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-[var(--rose-gold)]" />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-2xl border border-[var(--border)]">
                                <h3 className="text-lg font-semibold mb-2">Không có sản phẩm nào</h3>
                                <p className="text-[var(--muted-foreground)]">Thử điều chỉnh bộ lọc để tìm thấy sản phẩm bạn yêu thích nhé</p>
                                <Button variant="outline" className="mt-4" onClick={() => { setMinPrice(undefined); setMaxPrice(undefined); }}>
                                    Xóa bộ lọc
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
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
            </div>
        </div>
    )
}
