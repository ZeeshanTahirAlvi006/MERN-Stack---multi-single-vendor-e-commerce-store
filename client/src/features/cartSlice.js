import { createSlice } from '@reduxjs/toolkit';

const cartFromStorage = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { items: [], itemCount: 0, subtotal: 0, lastUpdated: null };

const recalc = (state) => {
  state.itemCount = state.items.reduce((sum, i) => sum + i.qty, 0);
  state.subtotal = state.items.reduce((sum, i) => sum + i.price * i.qty, 0);
  state.lastUpdated = new Date().toISOString();
  localStorage.setItem('cart', JSON.stringify(state));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: cartFromStorage,
  reducers: {
    addToCart: (state, action) => {
      const { productId, name, price, qty, image, vendorId, stock } = action.payload;
      const existing = state.items.find((i) => i.productId === productId);

      if (existing) {
        existing.qty = Math.min(existing.qty + qty, stock);
        existing.stock = stock;
      } else {
        state.items.push({ productId, name, price, qty, image, vendorId, stock });
      }
      recalc(state);
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i.productId !== action.payload);
      recalc(state);
    },
    updateQty: (state, action) => {
      const { productId, qty } = action.payload;
      const item = state.items.find((i) => i.productId === productId);
      if (item) {
        item.qty = Math.max(1, Math.min(qty, item.stock));
      }
      recalc(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
      state.subtotal = 0;
      state.lastUpdated = new Date().toISOString();
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
