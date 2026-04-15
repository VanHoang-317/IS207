"use client"

import { useEffect, useState } from "react"
import api from "@/lib/api"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Edit, Trash } from "lucide-react"

export default function AdminProductsPage() {
    const [products, setProducts] = useState<any[]>([])

    useEffect(() => {
        api.get("/products")
            .then(res => setProducts(res.data.products || []))
            .catch(err => console.error(err))
    }, [])

    const handleDelete = async (id: string) => {
        if (!confirm("Chắc chưa?")) return
        try {
            await api.delete(`/products/${id}`)
            setProducts(products.filter(p => p.id !== id))
        } catch (err) {
            alert("Lỗi khi xóa")
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold">Sản phẩm</h1>
                <Button asChild>
                    <Link href="/admin/products/new"><Plus className="mr-2 h-4 w-4" />Thêm</Link>
                </Button>
            </div>

            <div className="bg-card rounded-lg border shadow-sm overflow-hidden">
                <table className="w-full text-sm text-left">
                    <thead className="bg-muted text-muted-foreground font-medium border-b">
                        <tr>
                            <th className="p-4">Tên</th>
                            <th className="p-4">Giá</th>
                            <th className="p-4">Số lượng</th>
                            <th className="p-4 text-right">Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(product => (
                            <tr key={product.id} className="border-b last:border-0 hover:bg-muted/50">
                                <td className="p-4 font-medium">{product.name}</td>
                                <td className="p-4">{new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price)}</td>
                                <td className="p-4">{product.stock}</td>
                                <td className="p-4 text-right space-x-2">
                                    <Button variant="ghost" size="icon" asChild>
                                        <Link href={`/admin/products/edit/${product.id}`}><Edit className="h-4 w-4" /></Link>
                                    </Button>
                                    <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                                        <Trash className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {products.length === 0 && <div className="p-8 text-center text-muted-foreground">Không có sản phẩm nào</div>}
            </div>
        </div>
    )
}
