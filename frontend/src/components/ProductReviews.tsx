"use client"

import { useState } from "react"
import api from "@/lib/api"
import { useAuthStore } from "@/store/authStore"
import { useRouter } from "next/navigation"
import { Star, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProductReviewsProps {
    productId: string
    reviewsList: any[]
    averageRating: number
    totalReviews: number
    onReviewAdded: () => void
}

export default function ProductReviews({ productId, reviewsList, averageRating, totalReviews, onReviewAdded }: ProductReviewsProps) {
    const { token, user } = useAuthStore()
    const router = useRouter()

    const [showForm, setShowForm] = useState(false)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    const [rating, setRating] = useState(5)
    const [title, setTitle] = useState("")
    const [comment, setComment] = useState("")

    const handleWriteReviewClick = () => {
        if (!token) {
            router.push('/login?redirect=' + encodeURIComponent(window.location.pathname))
            return
        }
        setShowForm(true)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError("")
        try {
            await api.post(`/reviews/${productId}`, {
                rating,
                title,
                comment
            })
            setShowForm(false)
            setTitle("")
            setComment("")
            setRating(5)
            onReviewAdded() // Refresh data
        } catch (err: any) {
            console.error("Failed to submit review", err)
            setError(err.response?.data?.message || "Something went wrong.")
        } finally {
            setSubmitting(false)
        }
    }

    // Helper to extract initials safely
    const getInitials = (name: string) => {
        if (!name) return "U"
        return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase()
    }

    return (
        <div className="mt-20 pt-10 border-t border-[var(--border)]">
            <h2 className="text-2xl font-bold mb-8 font-playfair">Customer Reviews</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Summary Col */}
                <div className="bg-[var(--soft-gray)] p-6 rounded-2xl flex flex-col items-center justify-center text-center space-y-2 h-fit">
                    <span className="text-5xl font-bold text-[var(--foreground)]">{averageRating.toFixed(1)}</span>
                    <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <Star key={i} className={`h-5 w-5 ${i <= Math.round(averageRating) ? 'fill-[var(--rose-gold)] text-[var(--rose-gold)]' : 'text-[var(--border)]'}`} />
                        ))}
                    </div>
                    <span className="text-sm text-[var(--muted-foreground)] mt-2">Based on {totalReviews} review{totalReviews !== 1 ? 's' : ''}</span>

                    {!showForm && (
                        <Button
                            onClick={handleWriteReviewClick}
                            variant="outline"
                            className="mt-6 rounded-full w-full border-[var(--rose-gold)] text-[var(--rose-gold)] hover:bg-[var(--rose-gold)]/5 hover:text-[var(--rose-gold)] transition-colors"
                        >
                            Write a Review
                        </Button>
                    )}
                </div>

                {/* Reviews Content */}
                <div className="md:col-span-2 space-y-6">
                    {/* Write Review Form */}
                    {showForm && (
                        <div className="bg-white p-6 rounded-2xl border border-[var(--border)] shadow-sm animate-fade-in-down">
                            <h3 className="text-lg font-semibold mb-4">Share your thoughts</h3>
                            {error && <div className="text-red-500 text-sm mb-4 bg-red-50 p-3 rounded-lg">{error}</div>}
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Overall Rating</label>
                                    <div className="flex gap-1">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                className="focus:outline-none focus:scale-110 transition-transform"
                                                aria-label={`Rate ${star} stars`}
                                            >
                                                <Star className={`h-8 w-8 ${star <= rating ? 'fill-[var(--rose-gold)] text-[var(--rose-gold)]' : 'text-[var(--border)]'}`} />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="title" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Headline (Optional)</label>
                                    <input
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 outline-none focus:border-[var(--rose-gold)] transition-colors"
                                        placeholder="What's most important to know?"
                                    />
                                </div>
                                <div>
                                    <label htmlFor="comment" className="block text-sm font-medium text-[var(--muted-foreground)] mb-1">Written Review</label>
                                    <textarea
                                        id="comment"
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        required
                                        rows={4}
                                        className="w-full rounded-xl border border-[var(--border)] px-4 py-2.5 outline-none focus:border-[var(--rose-gold)] transition-colors resize-none"
                                        placeholder="What did you like or dislike? What did you use this product for?"
                                    />
                                </div>
                                <div className="flex justify-end gap-3 pt-2">
                                    <Button type="button" variant="ghost" onClick={() => setShowForm(false)} className="rounded-full">
                                        Cancel
                                    </Button>
                                    <Button type="submit" disabled={submitting} className="rounded-full gradient-primary text-white min-w-[120px]">
                                        {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit"}
                                    </Button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* Published Reviews List */}
                    <div className="space-y-6 flex-1">
                        {reviewsList.length === 0 ? (
                            <div className="text-center py-10 bg-[var(--soft-gray)] rounded-2xl border border-[var(--border)]">
                                <Star className="h-10 w-10 text-[var(--border)] mx-auto mb-3" />
                                <h3 className="font-medium text-[var(--foreground)]">No reviews yet</h3>
                                <p className="text-sm text-[var(--muted-foreground)] mt-1">Be the first to share your experience.</p>
                            </div>
                        ) : (
                            reviewsList.map((rev) => (
                                <div key={rev.id} className="border-b border-[var(--border)] pb-6 last:border-0 last:pb-0 animate-fade-in-up">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--rose-gold-light)] to-[var(--rose-gold)] flex items-center justify-center font-bold text-white text-xs shadow-sm">
                                                {getInitials(rev.user_name)}
                                            </div>
                                            <span className="font-semibold text-sm text-[var(--foreground)]">{rev.user_name}</span>
                                            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full flex items-center gap-1 font-medium"><Check className="h-3 w-3" /> Verified Buyer</span>
                                        </div>
                                        <span className="text-xs text-[var(--muted-foreground)]">
                                            {new Date(rev.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex mb-3">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star key={star} className={`h-3.5 w-3.5 ${star <= rev.rating ? 'fill-[var(--rose-gold)] text-[var(--rose-gold)]' : 'text-[var(--border)]'}`} />
                                        ))}
                                    </div>
                                    {rev.title && <h4 className="font-bold text-sm mb-1.5 text-[var(--foreground)]">{rev.title}</h4>}
                                    <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{rev.comment}</p>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
