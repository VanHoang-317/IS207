"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Package, Calendar, ChevronRight, ShoppingBag, Sparkles, User, LogOut, Loader2 } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

interface Order {
    id: string
    total_amount: string
    status: string
    created_at: string
    items: any[]
}

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

export default function DashboardPage() {
    const { token, user } = useAuthStore()
    const router = useRouter()
    const [orders, setOrders] = useState<Order[]>([])
    const [loading, setLoading] = useState(true)

    const formatVND = (amount: any) => {
        const value = parseFloat(amount || '0');
        return value.toLocaleString('vi-VN') + ' đ';
    }

    // --- LOGIC TÍNH TỔNG TIỀN CHO 1 ĐƠN HÀNG (BAO GỒM SHIP) ---
    const calculateOrderTotal = (order: Order) => {
        const subtotal = order.items?.reduce(
            (acc, item) => acc + (parseFloat(item.price) * item.quantity), 
            0
        ) || 0;
        const shippingFee = subtotal >= 500000 ? 0 : 30000;
        return subtotal + shippingFee;
    }

    useEffect(() => {
        if (!token) {
            router.push("/login")
            return
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get("/orders/myorders")
                setOrders(res.data)
            } catch (err) {
                console.error("Lỗi lấy đơn hàng:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [token, router])

    if (loading) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
            <Loader2 className="h-10 w-10 animate-spin text-[var(--rose-gold)]" />
            <p className="text-[var(--muted-foreground)] animate-pulse">Đang tải dữ liệu Fleur...</p>
        </div>
    )

    // Tính tổng chi tiêu (Cập nhật để tính cả phí ship của tất cả đơn hàng)
    const totalSpent = orders.reduce((sum, o) => sum + calculateOrderTotal(o), 0);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                {/* Welcome Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#d4a373] to-[#e9edc9] flex items-center justify-center shadow-sm">
                            <User className="h-7 w-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">
                                Chào mừng{user?.name ? `, ${user.name}` : " trở lại"}!
                            </h1>
                            <p className="text-[var(--muted-foreground)]">Đây là tổng quan các đơn hàng của bạn</p>
                        </div>
                    </div>
                    <Button
                        variant="outline"
                        className="rounded-full border-[var(--border)] text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors"
                        onClick={() => {
                            useAuthStore.getState().logout()
                            router.push("/")
                        }}
                    >
                        <LogOut className="h-4 w-4 mr-2" />
                        Đăng xuất
                    </Button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: "Tổng đơn hàng", value: orders.length, icon: Package },
                        { label: "Hoàn thành", value: orders.filter(o => o.status === 'paid' || o.status === 'delivered').length, icon: ShoppingBag },
                        { label: "Chờ xử lý", value: orders.filter(o => o.status === 'pending').length, icon: Calendar },
                        { label: "Tổng chi tiêu", value: formatVND(totalSpent), icon: Sparkles },
                    ].map((stat) => (
                        <div key={stat.label} className="bg-white rounded-2xl border border-[var(--border)] p-4 md:p-5 shadow-sm">
                            <stat.icon className="h-5 w-5 text-[var(--rose-gold)] mb-2" />
                            <p className="text-xl md:text-2xl font-bold truncate">{stat.value}</p>
                            <p className="text-xs text-[var(--muted-foreground)] mt-1">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* Orders Section */}
                <div>
                    <h2 className="text-xl font-bold mb-6">Đơn hàng gần đây</h2>

                    {orders.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-3xl border border-[var(--border)]">
                            <div className="w-20 h-20 rounded-full bg-[var(--blush)] flex items-center justify-center mx-auto mb-4">
                                <Package className="h-8 w-8 text-[var(--rose-gold)]" />
                            </div>
                            <h3 className="text-lg font-semibold mb-2">Chưa có đơn hàng nào</h3>
                            <p className="text-[var(--muted-foreground)] mb-6">Bắt đầu mua sắm để thấy đơn hàng của bạn tại đây.</p>
                            <Button className="rounded-full bg-[#d4a373] text-white px-8 hover:bg-[#bc8a5f]" asChild>
                                <Link href="/products/skin-care">Mua sắm ngay</Link>
                            </Button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map((order) => {
                                // Tính toán giá tiền cuối cùng cho từng đơn hàng trong danh sách
                                const finalPrice = calculateOrderTotal(order);

                                return (
                                    <Card key={order.id} className="border border-[var(--border)] rounded-2xl bg-white overflow-hidden shadow-sm hover:shadow-md transition-all">
                                        <CardHeader className="pb-3">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-base font-semibold flex items-center gap-2">
                                                        <Package className="h-4 w-4 text-[var(--rose-gold)]" />
                                                        Đơn hàng #{order.id.slice(-8).toUpperCase()}
                                                    </CardTitle>
                                                    <div className="flex items-center gap-1.5 mt-1 text-xs text-[var(--muted-foreground)]">
                                                        <Calendar className="h-3 w-3" />
                                                        {new Date(order.created_at).toLocaleDateString('vi-VN', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                    </div>
                                                </div>
                                                <span className={`px-3 py-1 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[order.status] || "bg-gray-100 text-gray-500"}`}>
                                                    {STATUS_LABELS[order.status] || order.status}
                                                </span>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="pt-0">
                                            <div className="flex items-center justify-between border-t border-gray-50 pt-4">
                                                <div>
                                                    <span className="text-lg font-bold text-[var(--foreground)]">
                                                        {/* Hiển thị giá đã tính phí ship */}
                                                        {formatVND(finalPrice)}
                                                    </span>
                                                    {order.items && (
                                                        <span className="text-xs text-[var(--muted-foreground)] ml-2 italic">
                                                            • {order.items.length} sản phẩm
                                                        </span>
                                                    )}
                                                </div>
                                                <Link href={`/dashboard/orders/${order.id}`}>
                                                    <div className="flex items-center text-sm text-[var(--rose-gold)] font-medium cursor-pointer hover:underline">
                                                        Chi tiết <ChevronRight className="h-4 w-4 ml-1" />
                                                    </div>
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}