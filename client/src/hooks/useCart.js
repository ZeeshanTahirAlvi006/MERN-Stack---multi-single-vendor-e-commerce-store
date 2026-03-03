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

  const addToCart = (product, qty = 1) =>
    dispatch(
      addAction({
        productId: product._id,
        name: product.name,
        price: product.price,
        qty,
        image: product.images?.[0] || '',
        vendorId: product.vendor?._id || product.vendorId || '',
        stock: product.stock,
      })
    );
  const removeFromCart = (productId) => dispatch(removeAction(productId));
  const updateQty = (productId, qty) => dispatch(updateAction({ productId, qty }));
  const clearCart = () => dispatch(clearAction());

  return { items, itemCount, subtotal, lastUpdated, addToCart, removeFromCart, updateQty, clearCart };
};

export default useCart;
