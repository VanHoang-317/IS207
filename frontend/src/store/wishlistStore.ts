import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import api from '@/lib/api'

interface WishlistState {
    items: string[] // Array of product IDs
    loading: boolean
    fetchWishlist: () => Promise<void>
    toggleItem: (productId: string) => Promise<void>
    isInWishlist: (productId: string) => boolean
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            loading: false,
            fetchWishlist: async () => {
                set({ loading: true })
                try {
                    const res = await api.get('/wishlist')
                    // Assuming res.data is an array of products { id: string, ... }
                    set({ items: res.data.map((item: any) => item.id) })
                } catch (error) {
                    console.error("Failed to fetch wishlist", error)
                } finally {
                    set({ loading: false })
                }
            },
            toggleItem: async (productId: string) => {
                const currentItems = get().items;
                const isCurrentlySaved = currentItems.includes(productId);

                // Optimistic UI update
                set({
                    items: isCurrentlySaved
                        ? currentItems.filter(id => id !== productId)
                        : [...currentItems, productId]
                });

                try {
                    await api.post('/wishlist/toggle', { productId })
                } catch (error) {
                    console.error("Failed to toggle wishlist item", error)
                    // Revert optimistic update on failure
                    set({ items: currentItems });
                }
            },
            isInWishlist: (productId: string) => get().items.includes(productId)
        }),
        {
            name: 'wishlist-storage',
            partialize: (state) => ({ items: state.items }), // Persist only the array of IDs
        }
    )
)
