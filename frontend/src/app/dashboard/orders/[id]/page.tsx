"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { formatPrice } from "@/lib/formatPrice"
import Link from "next/link"
import { Package, ArrowLeft, Calendar, MapPin, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

const STATUS_LABELS: Record<string, string> = {
    paid: "Đã thanh toán",
    pending: "Chờ xử lý",
    cancelled: "Đã hủy",
    delivered: "Đã giao hàng",
    shipped: "Đang giao hàng",
}

const STATUS_STYLES: Record<string, string> = {
    paid: "bg-emerald-50 text-emerald-600",
    pending: "bg-amber-50 text-amber-600",
    cancelled: "bg-red-50 text-red-600",
    delivered: "bg-blue-50 text-blue-600",
    shipped: "bg-blue-50 text-blue-600",
}

export default function OrderDetailPage() {
    const params = useParams()
    const router = useRouter()
    const { token } = useAuthStore()
    const id = params.id as string

    const [order, setOrder] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!token) {
            router.push("/login")
            return
        }
        api.get(`/orders/${id}`)
            .then(res => setOrder(res.data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false))
    }, [id, token, router])

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-[var(--rose-gold)]" />
        </div>
    )

    if (!order) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
                <Button asChild variant="outline"><Link href="/dashboard">Quay lại</Link></Button>
            </div>
        </div>
    )

    // --- LOGIC TÍNH TOÁN ĐỂ ĐỒNG BỘ VỚI CART PAGE ---
    // Tính tạm tính dựa trên danh sách sản phẩm thực tế
    const subtotal = order.items?.reduce(
        (acc: number, item: any) => acc + parseFloat(item.price) * item.quantity, 
        0
    ) || 0;

    // Phí ship: Dưới 500k là 30k, trên 500k là 0
    const shippingFee = subtotal >= 500000 ? 0 : 30000;
    
    // Tổng tiền cuối cùng
    const finalTotal = subtotal + shippingFee;

    const address = typeof order.shipping_address === 'string'
        ? JSON.parse(order.shipping_address)
        : order.shipping_address

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12 max-w-3xl">
                {/* Back */}
                <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-6">
                    <ArrowLeft className="h-4 w-4" /> Quay lại đơn hàng
                </Link>

                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center gap-2">
                            <Package className="h-6 w-6 text-[var(--rose-gold)]" />
                            Đơn hàng #{order.id.slice(-8).toUpperCase()}
                        </h1>
                        <div className="flex items-center gap-1.5 mt-1 text-sm text-[var(--muted-foreground)]">
                            <Calendar className="h-3.5 w-3.5" />
                            {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-600"}`}>
                        {STATUS_LABELS[order.status] || order.status}
                    </span>
                </div>

                {/* Danh sách Sản phẩm */}
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-4 shadow-sm">
                    <h2 className="font-bold text-base mb-4">Sản phẩm đã đặt</h2>
                    <div className="space-y-4">
                        {order.items && order.items.length > 0 ? (
                            order.items.map((item: any, i: number) => (
                                <div key={i} className="flex items-center gap-4 pb-4 border-b border-[var(--border)] last:border-0 last:pb-0">
                                    <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-[var(--blush)] to-[var(--secondary)] flex items-center justify-center shrink-0 overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.product_name} className="w-full h-full object-cover" />
                                        ) : (
                                            <Sparkles className="h-6 w-6 text-[#c9a87c] opacity-50" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-semibold truncate">{item.product_name}</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">Số lượng: {item.quantity}</p>
                                        <p className="text-sm text-[var(--muted-foreground)]">Đơn giá: {formatPrice(parseFloat(item.price))}</p>
                                    </div>
                                    <p className="font-bold text-[var(--rose-gold)]">
                                        {formatPrice(parseFloat(item.price) * item.quantity)}
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-sm text-[var(--muted-foreground)]">Không có thông tin sản phẩm</p>
                        )}
                    </div>
                </div>

                {/* Địa chỉ giao hàng */}
                {address && (
                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 mb-4 shadow-sm">
                        <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[var(--rose-gold)]" />
                            Địa chỉ giao hàng
                        </h2>
                        <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">
                            {address.street}, {address.city}, {address.state}, {address.zip}, {address.country}
                        </p>
                    </div>
                )}

                {/* Tóm tắt thanh toán - ĐÃ ĐỒNG BỘ UI VỚI CART PAGE */}
                <div className="bg-white rounded-2xl border border-[var(--border)] p-6 space-y-4 shadow-sm">
                    <h2 className="font-bold text-lg border-b border-[var(--border)] pb-3">Tóm tắt thanh toán</h2>

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <span className="text-[var(--muted-foreground)]">
                                Tạm tính ({order.items?.length || 0} món)
                            </span>
                            <span className="font-medium">{formatPrice(subtotal)}</span>
                        </div>
                        
                        <div className="flex justify-between">
                            <span className="text-[var(--muted-foreground)]">Vận chuyển</span>
                            <span className={`${shippingFee === 0 ? 'text-emerald-600 font-bold' : 'font-medium'}`}>
                                {shippingFee === 0 ? "Miễn phí" : formatPrice(shippingFee)}
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
                                {formatPrice(finalTotal)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}