import { create } from "zustand";
import { persist } from "zustand/middleware";

interface WishlistState {
  items: string[];
  addItem: (handle: string) => void;
  removeItem: (handle: string) => void;
  toggleItem: (handle: string) => void;
  isInWishlist: (handle: string) => boolean;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (handle) => set((state) => {
        if (!state.items.includes(handle)) {
          return { items: [...state.items, handle] };
        }
        return state;
      }),
      removeItem: (handle) => set((state) => ({
        items: state.items.filter((item) => item !== handle)
      })),
      toggleItem: (handle) => set((state) => {
        if (state.items.includes(handle)) {
          return { items: state.items.filter((item) => item !== handle) };
        }
        return { items: [...state.items, handle] };
      }),
      isInWishlist: (handle) => get().items.includes(handle),
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: "fashion-sf-wishlist",
    }
  )
);
