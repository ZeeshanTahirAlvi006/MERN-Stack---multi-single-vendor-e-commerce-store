import { useSelector, useDispatch } from 'react-redux';
import {
  addToCart as addAction,
  removeFromCart as removeAction,
  updateQty as updateAction,
  clearCart as clearAction,
} from '../features/cartSlice';

const useCart = () => {
  const dispatch = useDispatch();
  const { items, itemCount, subtotal, lastUpdated } = useSelector((s) => s.cart);

  const addToCart = (product) => dispatch(addAction(product));
  const removeFromCart = (productId) => dispatch(removeAction(productId));
  const updateQty = (productId, qty) => dispatch(updateAction({ productId, qty }));
  const clearCart = () => dispatch(clearAction());

  return { items, itemCount, subtotal, lastUpdated, addToCart, removeFromCart, updateQty, clearCart };
};

export default useCart;
