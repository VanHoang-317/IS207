"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { CheckCircle2, ArrowRight, Copy } from "lucide-react"

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams()
    const [mounted, setMounted] = useState(false)
    const type = searchParams.get('type')
    const urlOrderId = searchParams.get('orderId')

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Rút gọn mã nếu quá dài (ví dụ lấy 8 ký tự cuối) hoặc dùng mã pseudo
    const displayOrderId = urlOrderId 
        ? (urlOrderId.length > 12 ? urlOrderId.slice(-8).toUpperCase() : urlOrderId)
        : `ORD${Math.floor(100000 + Math.random() * 900000)}`

    return (
        <div className="min-h-[80vh] flex items-center justify-center p-4 bg-[var(--soft-gray)] animate-fade-in">
            <div className="max-w-md w-full bg-white rounded-3xl border border-[var(--border)] p-8 md:p-12 text-center relative overflow-hidden shadow-sm">

                {/* Decorative background glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[var(--blush)] blur-[80px] rounded-full opacity-50 pointer-events-none" />

                <div className="relative z-10 space-y-6">
                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6 scale-in">
                        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>

                    <h1 className="text-3xl font-playfair font-bold text-[var(--foreground)]">
                        {type === 'cod' ? 'Đặt hàng thành công!' : 'Thanh toán thành công!'}
                    </h1>

                    <p className="text-[var(--muted-foreground)] leading-relaxed">
                        {type === 'cod'
                            ? "Cảm ơn bạn! Đơn hàng của bạn đã được ghi nhận. Bạn sẽ thanh toán khi nhận hàng."
                            : "Tuyệt vời! Chúng tôi đã nhận được thanh toán của bạn. Đơn hàng đang được chuẩn bị."}
                    </p>

                    {/* Box thông tin đơn hàng đã chỉnh sửa cho đẹp hơn */}
                    <div className="bg-[var(--soft-gray)] rounded-2xl p-6 mt-8 mb-8 border border-[var(--border)] space-y-4">
                        <div className="text-center pb-2 border-b border-gray-200/50">
                            <span className="text-[var(--muted-foreground)] block text-xs uppercase tracking-wider mb-1">Mã đơn hàng của bạn</span>
                            <span className="font-bold font-mono text-xl text-[var(--foreground)] break-all px-2">
                                #{displayOrderId}
                            </span>
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                            <span className="text-[var(--muted-foreground)] text-sm">Giao hàng dự kiến</span>
                            <span className="font-semibold text-[var(--foreground)] text-sm">3 - 5 ngày làm việc</span>
                        </div>
                    </div>

                    <div className="space-y-3 pt-4">
                        <Button
                            asChild
                            className="w-full rounded-full gradient-primary text-white py-6 btn-shimmer shadow-lg shadow-amber-200/50"
                        >
                            <Link href="/dashboard">
                                Theo dõi đơn hàng <ArrowRight className="h-4 w-4 ml-2" />
                            </Link>
                        </Button>
                        <Button
                            asChild
                            variant="outline"
                            className="w-full rounded-full py-6 border-[var(--border)] hover:bg-[var(--soft-gray)] transition-colors text-[var(--muted-foreground)]"
                        >
                            <Link href="/">
                                Tiếp tục mua sắm
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}