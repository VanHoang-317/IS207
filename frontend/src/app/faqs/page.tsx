"use client"

import { useState } from "react"
import { Plus, Minus } from "lucide-react"

const FAQS = [
    {
        category: "Tài khoản",
        questions: [
            {
                q: "Tôi muốn nhận bản tin và khuyến mãi đặc biệt.",
                a: "Bạn có thể đăng ký nhận bản tin bằng cách nhập email vào ô đăng ký ở cuối trang. Chúng tôi sẽ gửi các ưu đãi độc quyền và thông tin sản phẩm mới nhất đến bạn."
            },
            {
                q: "Tôi quên mật khẩu, làm sao để đăng nhập lại?",
                a: "Tại màn hình đăng nhập, nhấn vào 'Quên mật khẩu?'. Hệ thống sẽ gửi email xác minh để bạn đặt lại mật khẩu mới."
            },
            {
                q: "Làm thế nào để thay đổi thông tin tài khoản?",
                a: "Đăng nhập vào tài khoản, vào trang Dashboard và chỉnh sửa thông tin cá nhân của bạn tại đó."
            },
        ]
    },
    {
        category: "Đặt hàng & Thanh toán",
        questions: [
            {
                q: "Tôi có thể thanh toán bằng những hình thức nào?",
                a: "Fleur hỗ trợ thanh toán bằng thẻ tín dụng/ghi nợ, ví MoMo và thanh toán khi nhận hàng (COD)."
            },
            {
                q: "Đơn hàng của tôi có được xác nhận ngay không?",
                a: "Sau khi thanh toán thành công, bạn sẽ nhận email xác nhận đơn hàng ngay lập tức. Nếu chưa thấy, hãy kiểm tra hộp thư rác."
            },
            {
                q: "Tôi có thể hủy đơn hàng sau khi đặt không?",
                a: "Bạn có thể hủy đơn trong vòng 1 giờ sau khi đặt. Vui lòng liên hệ hỗ trợ ngay để được xử lý kịp thời."
            },
        ]
    },
    {
        category: "Giao hàng",
        questions: [
            {
                q: "Thời gian giao hàng là bao lâu?",
                a: "Nội thành TP.HCM và Hà Nội: 1-2 ngày làm việc. Các tỉnh thành khác: 3-5 ngày làm việc."
            },
            {
                q: "Fleur có giao hàng miễn phí không?",
                a: "Chúng tôi miễn phí giao hàng cho tất cả đơn hàng. Không có giá trị đơn hàng tối thiểu."
            },
            {
                q: "Tôi có thể theo dõi đơn hàng ở đâu?",
                a: "Bạn có thể xem trạng thái đơn hàng trong phần Dashboard sau khi đăng nhập."
            },
        ]
    },
    {
        category: "Đổi trả & Hoàn tiền",
        questions: [
            {
                q: "Chính sách đổi trả của Fleur như thế nào?",
                a: "Chúng tôi chấp nhận đổi trả trong vòng 30 ngày kể từ ngày nhận hàng nếu sản phẩm bị lỗi hoặc không đúng mô tả."
            },
            {
                q: "Tôi cần làm gì để yêu cầu đổi trả?",
                a: "Liên hệ đội ngũ hỗ trợ qua email hoặc trang Contact Us, kèm theo mã đơn hàng và ảnh sản phẩm bị lỗi."
            },
        ]
    },
]

function AccordionItem({ question, answer }: { question: string; answer: string }) {
    const [open, setOpen] = useState(false)

    return (
        <div className="border-b border-gray-200">
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between py-5 text-left"
            >
                <span className="text-base font-medium text-[#1a1a1a]">{question}</span>
                {open
                    ? <Minus className="h-5 w-5 text-emerald-500 shrink-0" />
                    : <Plus className="h-5 w-5 text-emerald-500 shrink-0" />
                }
            </button>
            {open && (
                <p className="text-sm text-[var(--muted-foreground)] pb-5 leading-relaxed">
                    {answer}
                </p>
            )}
        </div>
    )
}

export default function FaqsPage() {
    return (
        <div className="min-h-screen bg-white">
            <div className="container mx-auto px-6 lg:px-14 py-16 max-w-3xl">
                <h1 className="text-4xl md:text-5xl font-bold mb-12">FAQs</h1>

                <div className="space-y-10">
                    {FAQS.map((section) => (
                        <div key={section.category}>
                            <h2 className="text-base font-bold mb-2 text-[#1a1a1a]">{section.category}</h2>
                            <div className="border-t border-gray-200">
                                {section.questions.map((item) => (
                                    <AccordionItem
                                        key={item.q}
                                        question={item.q}
                                        answer={item.a}
                                    />
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}