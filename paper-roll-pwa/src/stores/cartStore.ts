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
  repeatOrder: (items: { productId: number; name: string; price: number; unit: string; quantity: number }[]) => void;
  totalAmount: () => number;
  totalItems: () => number;
}

const loadCart = (): CartItem[] => {
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items: CartItem[]) => {
  try {
    localStorage.setItem('cart', JSON.stringify(items));
  } catch {
  }
};

export const useCartStore = create<CartState>((set, get) => ({
  items: loadCart(), 

  addItem: (product) => {
    set((state) => {
      const existing = state.items.find((item) => item.productId === product.id);

      let newItems: CartItem[];
      if (existing) {
        newItems = state.items.map((item) =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        newItems = [
          ...state.items,
          {
            productId: product.id,
            name: product.name,
            price: product.price,
            unit: product.unit,
            quantity: 1,
          },
        ];
      }

      saveCart(newItems); 
      return { items: newItems };
    });
  },

  removeItem: (productId) => {
    set((state) => {
      const newItems = state.items.filter((item) => item.productId !== productId);
      saveCart(newItems);
      return { items: newItems };
    });
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => {
      const newItems = state.items.map((item) =>
        item.productId === productId ? { ...item, quantity } : item
      );
      saveCart(newItems);
      return { items: newItems };
    });
  },

  clearCart: () => {
    saveCart([]);
    set({ items: [] });
  },

  repeatOrder: (orderItems) => {
    set((state) => {
      const newItems = [...state.items];

      for (const orderItem of orderItems) {
        const existing = newItems.find((item) => item.productId === orderItem.productId);
        if (existing) {
          existing.quantity += orderItem.quantity;
        } else {
          newItems.push({
            productId: orderItem.productId,
            name: orderItem.name,
            price: orderItem.price,
            unit: orderItem.unit,
            quantity: orderItem.quantity,
          });
        }
      }

      saveCart(newItems);
      return { items: newItems };
    });
  },

  totalAmount: () => {
    return get().items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  totalItems: () => {
    return get().items.reduce((sum, item) => sum + item.quantity, 0);
  },
}));