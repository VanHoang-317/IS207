import { InfoPage } from "@/components/InfoPage"

export default function BestSellersPage() {
    return (
        <InfoPage
            eyebrow="Top picks"
            title="Best Sellers"
            description="Khám phá những sản phẩm được khách hàng yêu thích nhất tại Fluer, nổi bật nhờ hiệu quả ổn định, bảng thành phần lành tính và trải nghiệm sử dụng cao cấp."
            heroImage="https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=1200&h=900&fit=crop"
            heroAlt="Best seller beauty products"
            highlights={[
                "Được mua nhiều nhất trong các bộ sưu tập chăm sóc da và tóc",
                "Công thức dịu nhẹ, phù hợp cho routine hằng ngày",
                "Được đánh giá cao về độ cấp ẩm, phục hồi và độ mượt tóc",
                "Lựa chọn phù hợp nếu bạn mới bắt đầu với Fluer",
            ]}
            sections={[
                {
                    title: "Vì sao khách hàng yêu thích",
                    content: "Danh mục best sellers tập hợp những sản phẩm có tỷ lệ quay lại mua cao, phù hợp cho cả người mới bắt đầu lẫn người đã có routine chăm sóc cá nhân rõ ràng.",
                    items: [
                        "Serum cấp ẩm và làm sáng da dùng được cả sáng lẫn tối",
                        "Sữa rửa mặt dịu nhẹ giúp làm sạch mà không khô căng",
                        "Kem dưỡng phục hồi hàng rào bảo vệ da sau ngày dài",
                        "Các sản phẩm dưỡng tóc giúp giảm xơ rối và tăng độ bóng mượt",
                    ],
                },
                {
                    title: "Gợi ý mua sắm",
                    content: "Nếu bạn muốn bắt đầu nhanh, hãy ưu tiên các sản phẩm có tính ứng dụng rộng, dễ phối hợp trong routine và phù hợp nhiều loại da hoặc tóc.",
                    items: [
                        "Routine cơ bản: cleanser, serum, moisturizer",
                        "Routine tóc: shampoo dịu nhẹ, mask phục hồi, oil dưỡng đuôi tóc",
                        "Ưu tiên sản phẩm có tác dụng rõ ràng trong 2 đến 4 tuần",
                    ],
                },
            ]}
            cta={{ label: "Mua theo danh mục", href: "/products/skin-care" }}
        />
    )
}
