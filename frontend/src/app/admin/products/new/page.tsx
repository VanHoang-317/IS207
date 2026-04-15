"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Link as LinkIcon, X } from "lucide-react"

export default function NewProductPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        tag: "",
    })

    // CHUYỂN ĐỔI: Dùng mảng string để chứa link ảnh thay vì File[]
    const [images, setImages] = useState<string[]>([])
    const [newImageUrl, setNewImageUrl] = useState("")

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        if (name === "name") {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
            }))
        }
    }

    const addImageLink = (e: React.MouseEvent) => {
    e.preventDefault(); // Ngăn form bị reload hoặc submit nhầm
    if (newImageUrl.trim() && images.length < 5) {
        setImages(prev => [...prev, newImageUrl.trim()]);
        setNewImageUrl(""); 
    }
}

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            // CHỈNH LẠI: Gửi JSON thuần cho Backend, không dùng FormData nữa
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
                stock: parseInt(formData.stock),
                images: images, // Gửi thẳng mảng link ảnh
                ingredients: ""
            }

            await api.post("/products", payload)
            router.push("/admin/products")
        } catch (err) {
            console.error(err)
            alert("Lỗi rồi! Kiểm tra lại link ảnh hoặc Backend nhé.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl bg-card p-8 rounded-lg border">
            <h1 className="text-2xl font-bold mb-6">Thêm sản phẩm mới (Fleur Beauty)</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required placeholder="Ví dụ: Kérastase Masque..." />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug (Tự động)</label>
                    <Input name="slug" value={formData.slug} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                        <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Số lượng</label>
                        <Input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <Input name="category" value={formData.category} onChange={handleChange} placeholder="hair-care, skin-care..." />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Mô tả</label>
                    <textarea
                        name="description"
                        className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Nhãn (Tag)</label>
                    <select
                        name="tag"
                        value={formData.tag}
                        onChange={handleChange}
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                        <option value="">Không có</option>
                        <option value="Best Seller">Best Seller</option>
                        <option value="New">New</option>
                        <option value="Sale">Sale</option>
                    </select>
                </div>

                {/* GIAO DIỆN DÁN LINK ẢNH MỚI */}
                <div className="pt-4 border-t">
                    <label className="block text-sm font-medium mb-2">Hình ảnh</label>
                    <div className="flex gap-2 mb-3">
                        <Input 
                            placeholder="Dán địa chỉ hình ảnh vào đây..." 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <Button 
                            type="button" 
                            onClick={(e) => addImageLink(e)}
                            variant="outline" 
                            disabled={images.length >= 5}
                        >
                            <LinkIcon className="h-4 w-4 mr-2" /> Thêm
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {images.map((src, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border bg-muted">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-800"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={loading}>
                    {loading ? "Đang tạo..." : "Tạo sản phẩm ngay"}
                </Button>
            </form>
        </div>
    )
}