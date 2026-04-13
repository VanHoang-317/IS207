"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, X } from "lucide-react"

export default function NewProductPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
        price: "",
        stock: "",
        category: "",
        description: "",
        tag: "",
    })
    const [images, setImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
    const [loading, setLoading] = useState(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Tự động tạo slug từ name
        if (name === "name") {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
            }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        if (files.length === 0) return

        // Giới hạn 5 ảnh
        const newImages = [...images, ...files].slice(0, 5)
        setImages(newImages)

        // Tạo preview
        const newPreviews = newImages.map(file => URL.createObjectURL(file))
        setPreviews(newPreviews)
    }

    const removeImage = (index: number) => {
        const newImages = images.filter((_, i) => i !== index)
        const newPreviews = previews.filter((_, i) => i !== index)
        setImages(newImages)
        setPreviews(newPreviews)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        try {
            const data = new FormData()
            data.append("name", formData.name)
            data.append("slug", formData.slug)
            data.append("price", formData.price)
            data.append("stock", formData.stock)
            data.append("category", formData.category)
            data.append("description", formData.description)
            data.append("ingredients", "")
            images.forEach(img => data.append("images", img))

            await api.post("/products", data, {
                headers: { "Content-Type": "multipart/form-data" }
            })

            router.push("/admin/products")
        } catch (err) {
            alert("Failed to create product")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-2xl bg-card p-8 rounded-lg border">
            <h1 className="text-2xl font-bold mb-6">Add New Product</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Name</label>
                    <Input name="name" value={formData.name} onChange={handleChange} required />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Slug</label>
                    <Input name="slug" value={formData.slug} onChange={handleChange} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Price</label>
                        <Input name="price" type="number" step="1000" value={formData.price} onChange={handleChange} required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Stock</label>
                        <Input name="stock" type="number" value={formData.stock} onChange={handleChange} required />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Category</label>
                    <Input name="category" value={formData.category} onChange={handleChange} />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Description</label>
                    <textarea
                        name="description"
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium mb-1">Tag</label>
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
                {/* ===== PHẦN UPLOAD ẢNH ===== */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Images <span className="text-muted-foreground">(tối đa 5 ảnh)</span>
                    </label>

                    {/* Preview ảnh đã chọn */}
                    {previews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-3">
                            {previews.map((src, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(i)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Nút chọn ảnh */}
                    {images.length < 5 && (
                        <label className="flex items-center gap-2 w-fit cursor-pointer border border-dashed border-input rounded-md px-4 py-3 text-sm text-muted-foreground hover:border-foreground hover:text-foreground transition-colors">
                            <ImagePlus className="h-4 w-4" />
                            Chọn ảnh
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="hidden"
                                onChange={handleImageChange}
                            />
                        </label>
                    )}
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Đang tạo..." : "Create Product"}
                </Button>
            </form>
        </div>
    )
}