"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ImagePlus, X } from "lucide-react"

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
    const [existingImages, setExistingImages] = useState<string[]>([])
    const [newImages, setNewImages] = useState<File[]>([])
    const [previews, setPreviews] = useState<string[]>([])
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
                setExistingImages(p.images || [])
            })
            .catch(err => console.error(err))
            .finally(() => setFetching(false))
    }, [id])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        if (name === "name") {
            setFormData(prev => ({
                ...prev,
                name: value,
                slug: value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")
            }))
        } else {
            setFormData(prev => ({ ...prev, [name]: value }))
        }
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        const combined = [...newImages, ...files].slice(0, 5)
        setNewImages(combined)
        setPreviews(combined.map(f => URL.createObjectURL(f)))
    }

    const removeExistingImage = (index: number) => {
        setExistingImages(prev => prev.filter((_, i) => i !== index))
    }

    const removeNewImage = (index: number) => {
        const updated = newImages.filter((_, i) => i !== index)
        setNewImages(updated)
        setPreviews(updated.map(f => URL.createObjectURL(f)))
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
            data.append("tag", formData.tag)
            data.append("existingImages", JSON.stringify(existingImages))
            newImages.forEach(img => data.append("images", img))

            await api.put(`/products/${id}`, data, {
                headers: { "Content-Type": "multipart/form-data" }
            })
            router.push("/admin/products")
        } catch (err) {
            alert("Failed to update product")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) return <div className="p-8 text-center">Đang tải...</div>

    return (
        <div className="max-w-2xl bg-card p-8 rounded-lg border">
            <h1 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h1>
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
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
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

                {/* Ảnh hiện tại */}
                {existingImages.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium mb-2">Ảnh hiện tại</label>
                        <div className="flex flex-wrap gap-3">
                            {existingImages.map((src, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Upload ảnh mới */}
                <div>
                    <label className="block text-sm font-medium mb-2">
                        Thêm ảnh mới <span className="text-muted-foreground">(tối đa 5 ảnh)</span>
                    </label>
                    {previews.length > 0 && (
                        <div className="flex flex-wrap gap-3 mb-3">
                            {previews.map((src, i) => (
                                <div key={i} className="relative w-24 h-24 rounded-md overflow-hidden border">
                                    <img src={src} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewImage(i)}
                                        className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5 hover:bg-black"
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    {(existingImages.length + newImages.length) < 5 && (
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
                    {loading ? "Đang lưu..." : "Lưu thay đổi"}
                </Button>
            </form>
        </div>
    )
}
