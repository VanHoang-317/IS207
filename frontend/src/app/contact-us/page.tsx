"use client"

import { useState } from "react"

export default function ContactUsPage() {
    const [form, setForm] = useState({ name: "", email: "", message: "" })
    const [sent, setSent] = useState(false)

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        setSent(true)
    }

    return (
        <div className="min-h-screen bg-[#f9f6f2]">
            {/* Hero */}
            <div className="container mx-auto px-6 lg:px-14 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
                    <p className="text-[var(--muted-foreground)] text-base leading-relaxed max-w-sm">
                        Chúng tôi luôn sẵn sàng hỗ trợ và sẽ phản hồi bạn trong vòng 1 ngày làm việc.
                    </p>
                </div>
                <div className="flex justify-center">
                    <img
                        src="/logo.png"
                        alt="Contact"
                        className="w-full max-w-md object-cover rounded-2xl"
                    />
                </div>
            </div>

            {/* Contact Info + Form */}
            <div className="container mx-auto px-6 lg:px-14 pb-24 grid grid-cols-1 md:grid-cols-2 gap-16">
                {/* Thông tin liên hệ */}
                <div className="space-y-8">
                    <div>
                        <p className="font-bold text-base mb-1">Email</p>
                        <p className="text-[var(--muted-foreground)]">support@fleur-beauty.com</p>
                    </div>
                    <div>
                        <p className="font-bold text-base mb-1">Điện thoại</p>
                        <p className="text-[var(--muted-foreground)]">1800 1234</p>
                        <p className="text-[var(--muted-foreground)] text-sm">Thứ Hai - Thứ Bảy, 9:00 - 21:00</p>
                    </div>
                    <div>
                        <p className="font-bold text-base mb-1">Địa chỉ</p>
                        <p className="text-[var(--muted-foreground)]">123 Nguyễn Huệ</p>
                        <p className="text-[var(--muted-foreground)]">Quận 1, TP. Hồ Chí Minh</p>
                        <p className="text-[var(--muted-foreground)]">Việt Nam</p>
                    </div>
                </div>

                {/* Form */}
                <div>
                    <h2 className="text-xl font-bold mb-6">Gửi tin nhắn cho chúng tôi</h2>
                    {sent ? (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-emerald-700 font-medium">
                            ✅ Tin nhắn đã được gửi! Chúng tôi sẽ phản hồi sớm nhất có thể.
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1">Tên</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--rose-gold)] bg-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={e => setForm({ ...form, email: e.target.value })}
                                        className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--rose-gold)] bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Tin nhắn</label>
                                <textarea
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={e => setForm({ ...form, message: e.target.value })}
                                    className="w-full border border-[var(--border)] rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-[var(--rose-gold)] bg-white resize-none"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg text-sm font-semibold hover:bg-black transition-colors"
                            >
                                Gửi tin nhắn
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}