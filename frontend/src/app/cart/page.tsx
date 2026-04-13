"use client"

import { useCartStore } from "@/store/cartStore"
import { Button } from "@/components/ui/button"
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, ShieldCheck, Truck, Sparkles } from "lucide-react"
import Link from "next/link"
import { formatPrice } from "@/lib/formatPrice"

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore()

    // Logic tính phí ship
    const subtotal = totalPrice()
    const isFreeShip = subtotal >= 500000
    const shippingFee = isFreeShip ? 0 : 30000
    const amountToFreeShip = 500000 - subtotal

    if (items.length === 0) {
        return (
            <div className="min-h-[70vh] flex items-center justify-center px-4">
                <div className="text-center space-y-6 max-w-md animate-fade-in-up">
                    <div className="w-24 h-24 rounded-full bg-[var(--blush)] flex items-center justify-center mx-auto">
                        <ShoppingBag className="h-10 w-10 text-[var(--rose-gold)]" />
                    </div>
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold mb-2">Giỏ hàng đang trống</h1>
                        <p className="text-[var(--muted-foreground)]">Có vẻ như bạn chưa chọn được sản phẩm nào. Hãy khám phá bộ sưu tập của chúng tôi nhé.</p>
                    </div>
                    <Button className="rounded-full gradient-primary text-white px-8 py-5 btn-shimmer" asChild>
                        <Link href="/products/skin-care" className="flex items-center gap-2">
                            Mua sắm ngay <ArrowRight className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <h1 className="text-3xl md:text-4xl font-bold mb-2">Giỏ hàng của bạn</h1>
                <p className="text-[var(--muted-foreground)] mb-8">{items.length} sản phẩm trong giỏ</p>

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Danh sách sản phẩm */}
                    <div className="flex-1 space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-5 flex gap-4 card-hover">
                                {/* Hình ảnh */}
                                <div className="h-24 w-24 md:h-28 md:w-28 bg-gradient-to-br from-[var(--blush)] to-[var(--secondary)] rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                                    {item.image ? (
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    ) : (
                                        <Sparkles className="h-8 w-8 text-[#c9a87c] opacity-40" />
                                    )}
                                </div>

                                {/* Chi tiết sản phẩm */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-start gap-2 mb-2">
                                        <h3 className="font-semibold text-base md:text-lg truncate">
                                            <Link href={`/product/${item.slug}`} className="hover:text-[var(--rose-gold)] transition-colors">
                                                {item.name}
                                            </Link>
                                        </h3>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            aria-label="Xóa sản phẩm"
                                            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--muted-foreground)] hover:text-[var(--destructive)] hover:bg-red-50 transition-all shrink-0"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>

                                    <p className="text-[var(--rose-gold)] font-semibold mb-3">{formatPrice(item.price)}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-[var(--border)] rounded-full overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--secondary)] transition-colors"
                                            >
                                                <Minus className="h-3 w-3" />
                                            </button>
                                            <span className="w-10 text-center text-sm font-semibold">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-[var(--secondary)] transition-colors"
                                            >
                                                <Plus className="h-3 w-3" />
                                            </button>
                                        </div>
                                        <span className="font-bold text-base">
                                            {formatPrice(item.price * item.quantity)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            onClick={clearCart}
                            className="text-sm text-[var(--muted-foreground)] hover:text-[var(--destructive)] transition-colors mt-2 px-2"
                        >
                            Xóa toàn bộ giỏ hàng
                        </button>
                    </div>

                    {/* Tóm tắt đơn hàng */}
                    <div className="w-full lg:w-96">
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="bg-white rounded-2xl border border-[var(--border)] p-6 space-y-4 shadow-sm">
                                <h2 className="font-bold text-lg border-b border-[var(--border)] pb-3">Tóm tắt đơn hàng</h2>

                                {/* Thông báo Freeship */}
                                <div className="space-y-3 py-2">
                                    {isFreeShip ? (
                                        <div className="flex items-center gap-2 text-sm text-emerald-600 font-medium bg-emerald-50 p-3 rounded-xl">
                                            <Sparkles className="h-4 w-4" />
                                            <span>Đơn hàng của bạn đã được Miễn phí vận chuyển!</span>
                                        </div>
                                    ) : (
                                        <div className="space-y-2">
                                            <p className="text-sm text-[var(--muted-foreground)]">
                                                Mua thêm <span className="font-bold text-[var(--rose-gold)]">{formatPrice(amountToFreeShip)}</span> để được <span className="font-bold text-slate-700">Miễn phí giao hàng</span>
                                            </p>
                                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                                <div 
                                                    className="h-full bg-[var(--rose-gold)] transition-all duration-700 ease-out"
                                                    style={{ width: `${Math.min((subtotal / 500000) * 100, 100)}%` }}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">Tạm tính ({items.length} món)</span>
                                        <span className="font-medium">{formatPrice(subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-[var(--muted-foreground)]">Vận chuyển</span>
                                        <span className={`${isFreeShip ? 'text-emerald-600 font-bold' : 'font-medium'}`}>
                                            {isFreeShip ? "Miễn phí" : formatPrice(shippingFee)}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[var(--muted-foreground)]">Thuế (VAT)</span>
                                        <span className="text-[10px] italic opacity-60">Đã bao gồm</span>
                                    </div>
                                </div>

                                <div className="border-t border-[var(--border)] pt-4 flex justify-between items-end">
                                    <span className="font-bold text-lg">Tổng cộng</span>
                                    <div className="text-right">
                                        <span className="font-bold text-2xl text-[var(--rose-gold)]">
                                            {formatPrice(subtotal + shippingFee)}
                                        </span>
                                    </div>
                                </div>

                                <Button className="w-full rounded-full gradient-primary text-white py-6 text-base btn-shimmer shadow-md" size="lg" asChild>
                                    <Link href="/checkout" className="flex items-center justify-center gap-2 font-semibold">
                                        Tiến hành thanh toán <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>

                            {/* Trust Strip */}
                            <div className="flex items-center justify-around py-2 px-4 bg-slate-50 rounded-xl border border-[var(--border)]">
                                <div className="flex flex-col items-center gap-1 text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                                    <ShieldCheck className="h-5 w-5 text-[var(--rose-gold)]" />
                                    <span>Bảo mật</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                                    <Truck className="h-5 w-5 text-[var(--rose-gold)]" />
                                    <span>Giao nhanh</span>
                                </div>
                                <div className="flex flex-col items-center gap-1 text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider">
                                    <Sparkles className="h-5 w-5 text-[var(--rose-gold)]" />
                                    <span>Chính hãng</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}