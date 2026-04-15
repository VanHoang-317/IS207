"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import ProductCard from "@/components/ProductCard"
import api from "@/lib/api"

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([])

  useEffect(() => {
    api.get("/products", { params: { limit: 4, sort: "newest" } })
      .then(res => setFeaturedProducts(res.data.products || []))
      .catch(err => console.error(err))
  }, [])

  return (
    <div className="flex flex-col">
      {/* ========= HERO SECTION ========= */}
      <section className="relative w-full">
        <div className="relative h-[calc(100vh-72px)] min-h-[600px]">
          <img
            src="/background.png"
            alt="#"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
          <div className="absolute inset-0 flex items-center">
            <div className="container mx-auto px-6 lg:px-14">
              <div className="max-w-lg">
                <p className="text-xs uppercase tracking-[0.2em] text-white/60 mb-4">Bộ sưu tập mới</p>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.1] mb-5">
                  Đánh thức<br />vẻ đẹp <br />thuần khiết.
                </h1>
                <p className="text-base text-white/70 leading-relaxed mb-8 max-w-sm">
                  Công thức sạch, thành phần tự nhiên, hiệu quả rõ rệt. Không hào nhoáng, chỉ có sự tận tâm.
                </p>
                <div className="flex gap-4">
                  <Button size="lg" className="bg-white text-[#1f1a17] px-8 py-6 text-sm font-medium rounded-lg hover:bg-white/90 transition-colors" asChild>
                    <Link href="/products/skin-care" className="flex items-center gap-2">
                      Khám phá ngay <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" className="border-white/30 text-white px-8 py-6 text-sm font-medium rounded-lg hover:bg-white/10 transition-colors" asChild>
                    <Link href="/products/hair-care">Chăm sóc tóc</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========= CATEGORIES ========= */}
      <section className="container mx-auto px-6 lg:px-14 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-foreground)] mb-2">Bộ sưu tập</p>
            <h2 className="text-2xl md:text-3xl font-bold">Danh mục sản phẩm</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Link href="/products/skin-care" className="group relative h-80 md:h-[420px] rounded-xl overflow-hidden block">
            <img
              src="https://img.freepik.com/premium-photo/beauty-products-skin-care-blue-background_1168123-19181.jpg?w=2000"
              alt="Skin Care"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3 className="text-2xl font-bold text-white mb-1">Chăm sóc da</h3>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors flex items-center gap-1.5">
                Khám phá ngay <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>

          <Link href="/products/hair-care" className="group relative h-80 md:h-[420px] rounded-xl overflow-hidden block">
            <img
              src="https://tse2.mm.bing.net/th/id/OIP.TvBOvkZeG1NjhGDASzix9wHaEJ?pid=Api&h=220&P=0"
              alt="Hair Care"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-7">
              <h3 className="text-2xl font-bold text-white mb-1">Chăm sóc tóc</h3>
              <span className="text-sm text-white/70 group-hover:text-white transition-colors flex items-center gap-1.5">
                Khám phá ngay <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* ========= FEATURED PRODUCTS ========= */}
      <section className="bg-[#f7f5f2] py-20">
        <div className="container mx-auto px-6 lg:px-14">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs uppercase tracking-[0.15em] text-[var(--muted-foreground)] mb-2">Gợi ý cho bạn</p>
              <h2 className="text-2xl md:text-3xl font-bold">Sản phẩm nổi bật</h2>
            </div>
            <Link href="/products/skin-care" className="hidden md:inline-flex items-center gap-1.5 text-sm font-medium text-[#1f1a17] hover:text-[#b8893c] transition-colors">
              Xem tất cả <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={parseFloat(product.price)}
                discountPrice={product.discount_price ? parseFloat(product.discount_price) : undefined}
                image={product.images?.[0] || 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600'}
                slug={product.slug}
                stock={product.stock}
                tag={product.tag || undefined}
              />
            ))}
          </div>

          <div className="text-center mt-8 md:hidden">
            <Button variant="outline" className="rounded-lg text-sm" asChild>
              <Link href="/products/skin-care" className="flex items-center gap-2">
                Xem tất cả <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ========= VALUES ========= */}
      <section className="border-y border-[var(--border)]">
        <div className="container mx-auto px-6 lg:px-14">
          <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-[var(--border)]">
            {[
              { label: "Tự nhiên", desc: "Thành phần thuần khiết" },
              { label: "Kiểm nghiệm", desc: "Chứng nhận bởi chuyên gia" },
              { label: "Nhân đạo", desc: "Không thử nghiệm trên động vật" },
              { label: "Thủ công", desc: "Chất lượng trong từng mẻ nhỏ" },
            ].map((item) => (
              <div key={item.label} className="py-8 px-6 text-center">
                <p className="text-sm font-semibold text-[#1f1a17]">{item.label}</p>
                <p className="text-xs text-[var(--muted-foreground)] mt-0.5">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ========= CTA ========= */}
      <section className="relative h-[400px]">
        <img
          src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&h=600&fit=crop&crop=center"
          alt="Woman applying skincare"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center max-w-md px-6">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Sẵn sàng để thay đổi
            </h2>
            <p className="text-sm text-white/65 mb-7">
              Đồng hành cùng hơn 10.000 khách hàng đã tối giản quy trình chăm sóc da cùng Fleur.
            </p>
            <Button size="lg" className="bg-white text-[#1f1a17] px-8 py-5 text-sm font-medium rounded-lg hover:bg-white/90 transition-colors" asChild>
              <Link href="/register">Bắt đầu ngay</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}