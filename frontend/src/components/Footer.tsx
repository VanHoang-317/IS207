"use client"  // ← thêm dòng này lên đầu

import { useState } from "react"  // ← thêm
import Link from "next/link"
import { Instagram, Twitter, Facebook, ArrowRight } from "lucide-react"

export function Footer() {
    const currentYear = new Date().getFullYear()
    const [email, setEmail] = useState("")  // ← thêm
    const [sent, setSent] = useState(false)  // ← thêm

    const handleNewsletter = (e: React.FormEvent) => {  // ← thêm
        e.preventDefault()
        if (email) setSent(true)
    }

    const shopLinks = [
        { href: "/products/skin-care", label: "Chăm sóc da" },
        { href: "/products/hair-care", label: "Chăm sóc tóc" },
        { href: `/tag/${encodeURIComponent('Best Seller')}`, label: "Best Sellers" },
    ]
    const supportLinks = [
        { href: "/contact-us", label: "Contact Us" },
        { href: "/faqs", label: "FAQs" },
    ]

    const socialLinks = [
    { icon: Instagram, href: "https://www.instagram.com/fleur.studio/" },
    { icon: Twitter, href: "https://www.tiktok.com/@kkk123561" },
    { icon: Facebook, href: "https://www.facebook.com/fluerhangsi" },
    ]

    return (
        <footer className="relative bg-[#F5E6DA] text-[#3E362E] overflow-hidden">
            <div className="h-px bg-[#D9C5B2] w-full" />

            <div className="container mx-auto px-4 lg:px-8 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">

                    {/* Brand */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2">
                            <img src="/logo.png" alt="Fleur Beauty Logo" className="h-11 w-11 md:h-16 md:w-16 object-contain" />
                            <span className="text-2xl font-bold tracking-tight text-[#b8893c]">Fleur</span>
                        </div>
                        <p className="text-sm text-[#5C544D] leading-relaxed max-w-xs">
                            Sản phẩm chăm sóc da và tóc cao cấp, được kết tinh từ những nguyên liệu thuần khiết nhất cho vẻ đẹp tự nhiên của bạn.
                        </p>
                       <div className="flex items-center gap-3 pt-2">
                        {socialLinks.map(({ icon: Icon, href }, idx) => (
                            <a 
                                key={idx} 
                                href={href}
                                target="_blank"  // ← mở tab mới
                                rel="noopener noreferrer"  // ← bảo mật
                                className="w-10 h-10 rounded-full border border-[#D9C5B2] flex items-center justify-center hover:bg-[#b8893c] hover:border-[#b8893c] hover:text-white transition-all duration-300"
                            >
                                <Icon className="h-4 w-4" />
                            </a>
                        ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#3E362E] mb-6">Cửa hàng</h4>
                        <ul className="space-y-3">
                            {shopLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-[#5C544D] hover:text-[#b8893c] font-medium transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#3E362E] mb-6">Hỗ trợ</h4>
                        <ul className="space-y-3">
                            {supportLinks.map((item) => (
                                <li key={item.label}>
                                    <Link href={item.href} className="text-sm text-[#5C544D] hover:text-[#b8893c] font-medium transition-colors">
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-[#3E362E] mb-6">Kết nối cùng Fleur</h4>
                        <p className="text-sm text-[#5C544D] mb-4">Nhận bí quyết làm đẹp và ưu đãi độc quyền.</p>

                        {sent ? (
                            <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-3 text-emerald-700 text-sm font-medium">
                                ✅ Đăng ký thành công! Cảm ơn bạn đã kết nối cùng Fleur.
                            </div>
                        ) : (
                            <form onSubmit={handleNewsletter} className="flex shadow-sm">
                                <input
                                    type="email"
                                    required
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="Email của bạn..."
                                    className="flex-1 px-4 py-2.5 bg-white border border-[#D9C5B2] rounded-l-lg text-sm focus:outline-none focus:border-[#b8893c]"
                                />
                                <button type="submit" className="px-5 py-2.5 bg-[#b8893c] text-white rounded-r-lg hover:bg-[#a67a32] transition-colors">
                                    <ArrowRight className="h-4 w-4" />
                                </button>
                            </form>
                        )}
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-[#D9C5B2] flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#8C8279]">
                        &copy; {currentYear} Fleur Beauty. All rights reserved.
                    </p>
                    <div className="flex items-center gap-6">
                        {["Chính sách", "Điều khoản", "Cookies"].map((item) => (
                            <a key={item} href="#" className="text-[10px] font-bold uppercase tracking-widest text-[#8C8279] hover:text-[#3E362E] transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}