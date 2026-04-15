"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, Link as LinkIcon } from "lucide-react"

export default function EditProductPage() {
    const router = useRouter()
    const params = useParams()
    const id = params.id as string

    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        tag: ""
    })
    
    // Quản lý ảnh bằng mảng string (link)
    const [images, setImages] = useState<string[]>([])
    const [newImageUrl, setNewImageUrl] = useState("") 
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)

    useEffect(() => {
        api.get(`/products/id/${id}`)
            .then(res => {
                const p = res.data
                setFormData({
                    name: p.name || "",
                    slug: p.slug || "",
                    price: p.price || "",
                    stock: String(p.stock) || "",
                    category: p.category || "",
                    description: p.description || "",
                    tag: p.tag || ""
                })

                // Xử lý dữ liệu ảnh từ DB (nếu là chuỗi JSON thì parse ra)
                let imgData = p.images || []
                if (typeof imgData === 'string') {
                    try { imgData = JSON.parse(imgData) } catch (e) { imgData = [imgData] }
                }
                setImages(Array.isArray(imgData) ? imgData : [])
            })
            .catch(err => console.error("Lỗi lấy chi tiết sp:", err))
            .finally(() => setFetching(false))
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === "name") {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().trim().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const addImageLink = () => {
        if (newImageUrl.trim() && images.length < 5) {
            setImages([...images, newImageUrl.trim()])
            setNewImageUrl("")
        }
    }

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            // Gửi dữ liệu dưới dạng JSON thuần túy
            const payload = {
                ...formData,
                images: JSON.stringify(images) // Đóng gói mảng link thành chuỗi
            }

            await api.put(`/products/${id}`, payload)
            alert("Cập nhật sản phẩm thành công!")
            router.push("/admin/products")
        } catch (err) {
            console.error(err)
            alert("Không thể cập nhật sản phẩm. Kiểm tra lại Backend!")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="p-8 text-center">Đang tải dữ liệu sản phẩm...</div>

    return (
        <div className="max-w-2xl bg-card p-8 rounded-lg border">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Tên sản phẩm</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug (Đường dẫn)</label>
                    <Input name="slug" value={formData.slug} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Giá (VNĐ)</label>
                        <Input name="price" type="number" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Kho hàng</label>
                        <Input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Danh mục</label>
                    <Input name="category" value={formData.category} onChange={handleChange} />
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
                        <option value="Popular">Popular</option>
                        <option value="Sale">Sale</option>
                    </select>
                </div>

                {/* PHẦN QUẢN LÝ LINK ẢNH */}
                <div className="pt-4 border-t space-y-4">
                    <label className="block text-sm font-medium">Hình ảnh sản phẩm</label>
                    
                    <div className="flex gap-2">
                        <Input 
                            placeholder="Dán link ảnh tại đây..." 
                            value={newImageUrl}
                            onChange={(e) => setNewImageUrl(e.target.value)}
                        />
                        <Button type="button" onClick={addImageLink} variant="secondary" disabled={images.length >= 5}>
                            <LinkIcon className="h-4 w-4 mr-2" /> Thêm
                        </Button>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        {images.map((src, i) => (
                            <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border bg-muted">
                                <img 
                                    src={src} 
                                    alt="" 
                                    className="w-full h-full object-cover" 
                                    onError={(e) => {(e.target as HTMLImageElement).src = 'https://placehold.co/200?text=Loi+Link'}}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeImage(i)}
                                    className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-0.5 hover:bg-red-800 transition-colors"
                                >
                                    <X className="h-3 w-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-muted-foreground italic">* Tối đa 5 ảnh.</p>
                </div>

                <Button type="submit" className="w-full mt-6" disabled={loading}>
                    {loading ? "Đang xử lý..." : "Lưu thay đổi"}
                </Button>
            </form>
        </div>
    )
}