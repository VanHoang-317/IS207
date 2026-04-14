"use client"

import { useState, useEffect } from "react"
import { useCartStore } from "@/store/cartStore"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import api from "@/lib/api"
import { formatPrice } from "@/lib/formatPrice"
import {
    MapPin, Building, Globe, Hash, ShieldCheck, Truck, RotateCcw,
    Loader2, Lock, Sparkles, ChevronRight, Check, CreditCard, Banknote,
    Smartphone, ArrowLeft, Package
} from "lucide-react"
import Script from "next/script"

const STEPS = [
    { id: 1, label: "Vận chuyển" },
    { id: 2, label: "Thanh toán" },
    { id: 3, label: "Xác nhận đơn hàng" },  
]

const PAYMENT_METHODS = [
    { id: "card", label: "Credit / Debit Card", icon: CreditCard, description: "Visa, Mastercard" },
    { id: "cod", label: "Thanh toán khi nhận hàng", icon: Banknote, description: "Thanh toán khi nhận hàng" },
    { id: "momo", label: "Ví MoMo", icon: Smartphone, description: "Quét mã QR để thanh toán qua MoMo" },
]

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore()
    // Tính toán phí ship và tổng thanh toán
    const subtotal = totalPrice();
    const isFreeShip = subtotal >= 500000;
    const shippingFee = isFreeShip ? 0 : 30000;
    const finalTotal = subtotal + shippingFee;
    const { user, token } = useAuthStore()
    const router = useRouter()

    const [address, setAddress] = useState({
        street: "",
        city: "",
        ward: "",
        district: "",
        zip: "",
        country: "Việt Nam"
    })
    const [loading, setLoading] = useState(false)
    const [currentStep, setCurrentStep] = useState(1)
    const [paymentMethod, setPaymentMethod] = useState("")
    const [cardDetails, setCardDetails] = useState({
        number: "",
        name: "",
        expiry: "",
        cvv: ""
    })

    useEffect(() => {
        if (!token) {
            router.push("/login?redirect=/checkout")
        }
    }, [token, router])

  const isAddressValid = address.street && address.district && address.city && address.ward;

    const isPaymentValid = () => {
        if (paymentMethod === "cod") return true
        if (paymentMethod === "card") return cardDetails.number.length >= 16 && cardDetails.name && cardDetails.expiry && cardDetails.cvv.length >= 3
        return false
    }

    const goToPayment = () => {
        if (isAddressValid) setCurrentStep(2)
    }

    const goToConfirmation = () => {
        if (isPaymentValid()) setCurrentStep(3)
    }

    const handlePlaceOrder = async () => {
        setLoading(true)
        try {
            const totalAmt = totalPrice()
            const orderItems = items.map(i => ({ product_id: i.id, product_name: i.name, quantity: i.quantity, price: i.price }))

            const { data: codOrder } = await api.post("/orders", {
                totalAmount: totalAmt,
                shippingAddress: address,
                status: "pending",
                items: orderItems
            })
            clearCart()
            router.push(`/checkout/success?type=${paymentMethod}&orderId=${codOrder.id || ''}`)
        } catch (err) {
            console.error(err)
            alert("Đặt hàng thất bại. Vui lòng thử lại.")
        } finally {
            setLoading(false)
        }
    }

    const formatCardNumber = (value: string) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
        const matches = v.match(/\d{4,16}/g)
        const match = matches && matches[0] || ''
        const parts = []
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4))
        }
        return parts.length ? parts.join(' ') : v
    }

    const formatExpiry = (value: string) => {
        const v = value.replace(/[^0-9]/g, '')
        if (v.length >= 2) return v.substring(0, 2) + '/' + v.substring(2, 4)
        return v
    }

    if (!items.length) return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="text-center space-y-4 animate-fade-in-up">
                <div className="w-20 h-20 rounded-full bg-[var(--blush)] flex items-center justify-center mx-auto">
                    <Sparkles className="h-8 w-8 text-[var(--rose-gold)]" />
                </div>
                <h2 className="text-xl font-bold">Giỏ hàng trống</h2>
                <p className="text-[var(--muted-foreground)]">Hãy thêm sản phẩm vào giỏ hàng trước!</p>
            </div>
        </div>
    )

    return (
        <div className="min-h-screen bg-[var(--soft-gray)]">
            <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="lazyOnload" />

            {/* Progress Stepper */}
            <div className="bg-white border-b border-[var(--border)]">
                <div className="container mx-auto px-4 lg:px-8 py-4">
                    <div className="flex items-center justify-center gap-2 md:gap-4 max-w-lg mx-auto">
                        {STEPS.map((step, index) => (
                            <div key={step.id} className="flex items-center gap-2 md:gap-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all duration-300 ${step.id < currentStep
                                        ? "bg-emerald-500 text-white"
                                        : step.id === currentStep
                                            ? "gradient-primary text-white shadow-md"
                                            : "bg-[var(--secondary)] text-[var(--muted-foreground)]"
                                        }`}>
                                        {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
                                    </div>
                                    <span className={`text-sm font-medium hidden sm:block ${step.id === currentStep ? "text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}>
                                        {step.label}
                                    </span>
                                </div>
                                {index < STEPS.length - 1 && (
                                    <div className={`w-8 md:w-16 h-0.5 rounded-full transition-colors duration-300 ${step.id < currentStep ? 'bg-emerald-500' : 'bg-[var(--border)]'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 lg:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    <div className="lg:col-span-2 space-y-6">

                        {/* STEP 1: Vận chuyển */}
                        {currentStep === 1 && (
                            <div className="animate-fade-in-up">
                                <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <MapPin className="h-5 w-5 text-[var(--rose-gold)]" />
                                        Địa chỉ giao hàng
                                    </h2>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Địa chỉ</label>
                                            <div className="relative">
                                                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                                <Input
                                                    placeholder="123 Nguyễn Huệ"
                                                    value={address.street}
                                                    onChange={e => setAddress({ ...address, street: e.target.value })}
                                                    className="pl-10 rounded-xl h-11"
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Thành phố</label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                                    <Input placeholder="Hồ Chí Minh" value={address.city} onChange={e => setAddress({ ...address, city: e.target.value })} className="pl-10 rounded-xl h-11" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Quận/Huyện</label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                                    <Input placeholder="Quận 1" value={address.district} onChange={e => setAddress({ ...address, district: e.target.value })} className="pl-10 rounded-xl h-11" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Phường/Xã</label>
                                                <div className="relative">
                                                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                                    <Input placeholder="Phường 1" value={address.ward} onChange={e => setAddress({ ...address, ward: e.target.value  })} className="pl-10 rounded-xl h-11" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Quốc gia</label>
                                                <div className="relative">
                                                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                                    <Input placeholder="Việt Nam" value={address.country} onChange={e => setAddress({ ...address, country: e.target.value })} className="pl-10 rounded-xl h-11" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-8 rounded-full gradient-primary text-white py-5 text-base btn-shimmer" onClick={goToPayment} disabled={!isAddressValid} size="lg">
                                        Tiếp tục thanh toán <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                </div>
                            </div>
                        )}

                        {/* STEP 2: PAYMENT */}
                        {currentStep === 2 && (
                            <div className="animate-fade-in-up space-y-6">
                                <button onClick={() => setCurrentStep(1)} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                                    <ArrowLeft className="h-4 w-4" /> Quay lại địa chỉ
                                </button>
                                <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8">
                                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                        <CreditCard className="h-5 w-5 text-[var(--rose-gold)]" />
                                        Phương thức thanh toán
                                    </h2>
                                    <div className="space-y-3">
                                        {PAYMENT_METHODS.map((method) => (
                                            <button key={method.id} onClick={() => setPaymentMethod(method.id)}
                                                className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all duration-200 text-left ${paymentMethod === method.id ? "border-[var(--rose-gold)] bg-amber-50/50 shadow-sm" : "border-[var(--border)] hover:border-[var(--rose-gold)]/40"}`}>
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${paymentMethod === method.id ? "bg-[var(--rose-gold)] text-white" : "bg-[var(--soft-gray)] text-[var(--muted-foreground)]"}`}>
                                                    <method.icon className="h-5 w-5" />
                                                </div>
                                                <div className="flex-1">
                                                    <p className="font-semibold text-sm">{method.label}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">{method.description}</p>
                                                </div>
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${paymentMethod === method.id ? "border-[var(--rose-gold)] bg-[var(--rose-gold)]" : "border-gray-300"}`}>
                                                    {paymentMethod === method.id && <Check className="h-3 w-3 text-white" />}
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {paymentMethod === "card" && (
                                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 animate-fade-in-up">
                                        <h3 className="font-bold mb-4 flex items-center gap-2">
                                            <Lock className="h-4 w-4 text-emerald-600" /> Thông tin thẻ
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Số thẻ</label>
                                                <div className="relative">
                                                    <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--muted-foreground)]" />
                                                    <Input placeholder="1234 5678 9012 3456" value={cardDetails.number} onChange={e => setCardDetails({ ...cardDetails, number: formatCardNumber(e.target.value) })} maxLength={19} className="pl-10 rounded-xl h-11 font-mono tracking-wider" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Tên chủ thẻ</label>
                                                <Input placeholder="NGUYEN VAN A" value={cardDetails.name} onChange={e => setCardDetails({ ...cardDetails, name: e.target.value })} className="rounded-xl h-11" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">Ngày hết hạn</label>
                                                    <Input placeholder="MM/YY" value={cardDetails.expiry} onChange={e => setCardDetails({ ...cardDetails, expiry: formatExpiry(e.target.value) })} maxLength={5} className="rounded-xl h-11 font-mono" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium text-[var(--muted-foreground)] mb-1.5 block">CVV</label>
                                                    <Input type="password" placeholder="•••" value={cardDetails.cvv} onChange={e => setCardDetails({ ...cardDetails, cvv: e.target.value.replace(/\D/g, '').slice(0, 4) })} maxLength={4} className="rounded-xl h-11 font-mono" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-emerald-600 bg-emerald-50 rounded-lg p-2.5">
                                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                                <span>Thông tin thẻ được mã hóa và bảo mật tuyệt đối.</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {paymentMethod === "cod" && (
                                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 animate-fade-in-up">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0">
                                                <Banknote className="h-5 w-5 text-amber-600" />
                                            </div>
                                            <div>
                                                <h3 className="font-bold mb-1">Thanh toán khi nhận hàng</h3>
                                                <p className="text-sm text-[var(--muted-foreground)]">Thanh toán bằng tiền mặt khi nhận được hàng.</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                {paymentMethod === "momo" && (
                                    <div className="bg-white rounded-2xl border border-[var(--border)] p-6 md:p-8 animate-fade-in-up">
                                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                                <Smartphone className="h-4 w-4 text-[#ae2070]" />
                                                Thanh toán qua MoMo
                                            </h3>
                                            <div className="flex flex-col items-center gap-4">
                                                {/* QR Code placeholder */}
                                             <div className="w-48 h-48 border-2 border-[#ae2070] rounded-2xl flex items-center justify-center bg-[#fce4f0] overflow-hidden">
    {/* Thay icon Smartphone bằng thẻ img */}
                                                    <img 
                                                        src="/qr.png" 
                                                        alt="QR MoMo" 
                                                        className="w-full h-full object-cover" 
                                                    />
                                                </div>
                                                <div className="text-center space-y-1">
                                                    <p className="text-sm font-semibold">Quét mã QR bằng ứng dụng MoMo</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">Mở app MoMo → Quét mã → Xác nhận thanh toán</p>
                                                    <p className="text-lg font-bold text-[#ae2070]">{formatPrice(totalPrice())}</p>
                                                </div>
                                                <div className="flex items-center gap-2 text-xs text-[#ae2070] bg-[#fce4f0] rounded-lg p-2.5 w-full">
                                                    <Smartphone className="h-4 w-4 shrink-0" />
                                                    <span>Sau khi thanh toán thành công, đơn hàng sẽ được xác nhận tự động.</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                {paymentMethod && (
                                    <Button className="w-full rounded-full gradient-primary text-white py-5 text-base btn-shimmer" onClick={goToConfirmation} disabled={!isPaymentValid()} size="lg">
                                        Xem lại đơn hàng <ChevronRight className="h-4 w-4 ml-1" />
                                    </Button>
                                )}
                            </div>
                        )}

                        {/* STEP 3: CONFIRMATION */}
                        {currentStep === 3 && (
                            <div className="animate-fade-in-up space-y-6">
                                <button onClick={() => setCurrentStep(2)} className="flex items-center gap-1.5 text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
                                    <ArrowLeft className="h-4 w-4" /> Quay lại thanh toán
                                </button>

                                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold flex items-center gap-2"><Truck className="h-4 w-4 text-[var(--rose-gold)]" />Địa chỉ giao hàng</h3>
                                        <button onClick={() => setCurrentStep(1)} className="text-xs text-[var(--rose-gold)] font-medium hover:underline">Sửa</button>
                                    </div>
                                    <p className="text-sm text-[var(--muted-foreground)]">{address.street}, {address.city}, {address.ward} — {address.district}, {address.country}</p>
                                </div>

                                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                                    <div className="flex items-center justify-between mb-3">
                                        <h3 className="font-bold flex items-center gap-2"><CreditCard className="h-4 w-4 text-[var(--rose-gold)]" />Phương thức thanh toán</h3>
                                        <button onClick={() => setCurrentStep(2)} className="text-xs text-[var(--rose-gold)] font-medium hover:underline">Sửa</button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        {paymentMethod === "card" && (<><CreditCard className="h-5 w-5 text-[var(--muted-foreground)]" /><span className="text-sm text-[var(--muted-foreground)]">Thẻ kết thúc bằng •••• {cardDetails.number.slice(-4)}</span></>)}
                                        {paymentMethod === "cod" && (<><Banknote className="h-5 w-5 text-[var(--muted-foreground)]" /><span className="text-sm text-[var(--muted-foreground)]">Thanh toán khi nhận hàng</span></>)}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                                    <h3 className="font-bold flex items-center gap-2 mb-4"><Package className="h-4 w-4 text-[var(--rose-gold)]" />Sản phẩm ({items.length})</h3>
                                    <div className="space-y-3">
                                        {items.map((item) => (
                                            <div key={item.id} className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--blush)] to-[var(--secondary)] flex items-center justify-center shrink-0">
                                                    <Sparkles className="h-4 w-4 text-[#c9a87c] opacity-50" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium truncate">{item.name}</p>
                                                    <p className="text-xs text-[var(--muted-foreground)]">Số lượng: {item.quantity}</p>
                                                </div>
                                                <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Button className="w-full rounded-full gradient-primary text-white py-6 text-base btn-shimmer shadow-lg" onClick={handlePlaceOrder} disabled={loading} size="lg">
                                    {loading ? (
                                        <span className="flex items-center gap-2"><Loader2 className="h-5 w-5 animate-spin" /> Đang xử lý...</span>
                                    ) : (
                                        <span className="flex items-center gap-2">
                                            <Lock className="h-4 w-4" />
                                            {paymentMethod === "cod" ? "Đặt hàng" : `Thanh toán ${formatPrice(totalPrice())}`}
                                        </span>
                                    )}
                                </Button>
                                <p className="text-[10px] text-[var(--muted-foreground)] text-center">Bằng cách đặt hàng, bạn đồng ý với Điều khoản dịch vụ và Chính sách bảo mật của chúng tôi.</p>
                            </div>
                        )}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="lg:sticky lg:top-24 space-y-4">
                            <div className="bg-white rounded-2xl border border-[var(--border)] p-6">
                                <h2 className="text-lg font-bold mb-4">Tóm tắt đơn hàng</h2>
                                <div className="space-y-3 mb-4">
                                    {items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-[var(--blush)] to-[var(--secondary)] flex items-center justify-center shrink-0">
                                                {item.image ? (
                                                    <img src={item.image} alt={item.name} className="w-full h-full object-cover rounded-lg" />
                                                ) : (
                                                    <Sparkles className="h-4 w-4 text-[#c9a87c] opacity-50" />
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-[var(--muted-foreground)]">Qty: {item.quantity}</p>
                                            </div>
                                            <span className="text-sm font-semibold">{formatPrice(item.price * item.quantity)}</span>
                                        </div>
                                    ))}
                                </div>
                               <div className="border-t border-[var(--border)] pt-4 space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-[var(--muted-foreground)]">Tạm tính</span>
                                    <span>{formatPrice(subtotal)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--muted-foreground)]">Vận chuyển</span>
                                    <span className={isFreeShip ? "text-emerald-600 font-medium" : "text-[var(--foreground)]"}>
                                        {isFreeShip ? "Miễn phí" : formatPrice(shippingFee)}
                                    </span>
                                </div>
                            </div>
                            <div className="border-t border-[var(--border)] mt-4 pt-4 flex justify-between items-baseline">
                                <span className="font-bold text-lg">Tổng cộng</span>
                                <span className="font-bold text-2xl text-[var(--rose-gold)]">
                                    {formatPrice(finalTotal)}
                                </span>
                            </div>
                            </div>

                            <div className="grid grid-cols-3 gap-3">
                                {[
                                    { icon: ShieldCheck, label: "Bảo mật" },
                                    { icon: Truck, label: "Miễn ship" },
                                    { icon: RotateCcw, label: "Đổi trả" },
                                ].map((badge) => (
                                    <div key={badge.label} className="flex flex-col items-center gap-1 py-3 bg-white rounded-xl border border-[var(--border)]">
                                        <badge.icon className="h-4 w-4 text-[var(--rose-gold)]" />
                                        <span className="text-[10px] font-medium text-[var(--muted-foreground)]">{badge.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
