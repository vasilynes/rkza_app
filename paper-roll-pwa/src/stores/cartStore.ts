import { create } from 'zustand';

export interface CartItem {
  productId: number;
  name: string;
  price: number;
  unit: string;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (product: { id: number; name: string; price: number; unit: string }) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalAmount: () => number;
  totalItems: () => number;
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id);
      
      if (existing) {
        return {
          items: state.items.map((item) =>
            item.productId === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      
      return {
        items: [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity: 1,
          },
        ],
      };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((item) => item.productId !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  totalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));