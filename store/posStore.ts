'use client';
import { create } from 'zustand';
import type { CartItem, Product, Customer, PaymentMethod } from '@/types';

interface PosState {
  cartItems: CartItem[];
  activeCustomer: Customer | null;
  discount: number; // order-level discount %
  taxRate: number;
  paymentMethod: PaymentMethod;
  isPaymentModalOpen: boolean;
  isReceiptModalOpen: boolean;
  lastOrderId: string | null;

  // Actions
  addItem: (product: Product) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
  setItemDiscount: (productId: string, discount: number) => void;
  clearCart: () => void;
  setActiveCustomer: (customer: Customer | null) => void;
  setDiscount: (discount: number) => void;
  setPaymentMethod: (method: PaymentMethod) => void;
  openPaymentModal: () => void;
  closePaymentModal: () => void;
  openReceiptModal: (orderId: string) => void;
  closeReceiptModal: () => void;

  // Computed helpers (not Zustand selectors — call these as functions)
  getSubtotal: () => number;
  getTax: () => number;
  getTotal: () => number;
  getItemCount: () => number;
}

export const usePosStore = create<PosState>((set, get) => ({
  cartItems: [],
  activeCustomer: null,
  discount: 0,
  taxRate: 9,
  paymentMethod: 'cash',
  isPaymentModalOpen: false,
  isReceiptModalOpen: false,
  lastOrderId: null,

  addItem: (product) =>
    set((state) => {
      const existing = state.cartItems.find((i) => i.product.id === product.id);
      if (existing) {
        return {
          cartItems: state.cartItems.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i,
          ),
        };
      }
      return {
        cartItems: [
          ...state.cartItems,
          { product, quantity: 1, unitPrice: product.price, discount: 0 },
        ],
      };
    }),

  updateQuantity: (productId, quantity) =>
    set((state) => ({
      cartItems:
        quantity <= 0
          ? state.cartItems.filter((i) => i.product.id !== productId)
          : state.cartItems.map((i) =>
              i.product.id === productId ? { ...i, quantity } : i,
            ),
    })),

  removeItem: (productId) =>
    set((state) => ({ cartItems: state.cartItems.filter((i) => i.product.id !== productId) })),

  setItemDiscount: (productId, discount) =>
    set((state) => ({
      cartItems: state.cartItems.map((i) =>
        i.product.id === productId ? { ...i, discount } : i,
      ),
    })),

  clearCart: () =>
    set({ cartItems: [], activeCustomer: null, discount: 0, paymentMethod: 'cash' }),

  setActiveCustomer: (customer) => set({ activeCustomer: customer }),

  setDiscount: (discount) => set({ discount }),

  setPaymentMethod: (method) => set({ paymentMethod: method }),

  openPaymentModal: () => set({ isPaymentModalOpen: true }),
  closePaymentModal: () => set({ isPaymentModalOpen: false }),

  openReceiptModal: (orderId) => set({ isReceiptModalOpen: true, lastOrderId: orderId }),
  closeReceiptModal: () => set({ isReceiptModalOpen: false }),

  getSubtotal: () => {
    const { cartItems } = get();
    return cartItems.reduce((sum, item) => {
      const itemTotal = item.unitPrice * item.quantity;
      const itemDiscount = itemTotal * (item.discount / 100);
      return sum + itemTotal - itemDiscount;
    }, 0);
  },

  getTax: () => {
    const { taxRate } = get();
    return get().getSubtotal() * (taxRate / 100);
  },

  getTotal: () => {
    const { discount } = get();
    const subtotal = get().getSubtotal();
    const tax = get().getTax();
    const orderDiscount = (subtotal + tax) * (discount / 100);
    return subtotal + tax - orderDiscount;
  },

  getItemCount: () => get().cartItems.reduce((s, i) => s + i.quantity, 0),
}));
