import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { useCartContext } from '../../context/CartContext';
import CartItem from '../CartItem/CartItem';
import EmptyState from '../EmptyState/EmptyState';
import { formatPrice, calculateCartTotals } from '../../utils/helpers';
import styles from './CartDrawer.module.css';

const CartDrawer = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, updateQuantity } = useCartContext();
  const { subtotal, tax, total } = calculateCartTotals(cartItems);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="drawer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <motion.div
            className="drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          >
            {/* Header */}
            <div className={styles.header}>
              <div className={styles.headerLeft}>
                <FiShoppingBag size={20} />
                <h2 className={styles.title}>Cart</h2>
                <span className={styles.count}>{cartItems.length}</span>
              </div>
              <button className={styles.closeBtn} onClick={onClose}>
                <FiX size={20} />
              </button>
            </div>

            {/* Items */}
            <div className={styles.body}>
              {cartItems.length === 0 ? (
                <EmptyState
                  icon={<FiShoppingBag />}
                  title="Your cart is empty"
                  description="Browse our products and add items to your cart."
                />
              ) : (
                <div className={styles.itemList}>
                  <AnimatePresence>
                    {cartItems.map((item) => (
                      <CartItem
                        key={item.id}
                        item={item}
                        onRemove={removeFromCart}
                        onQuantityChange={updateQuantity}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Footer summary */}
            {cartItems.length > 0 && (
              <div className={styles.footer}>
                <div className={styles.summary}>
                  <div className={styles.summaryRow}>
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.summaryRow}>
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                  <hr className="divider" style={{ margin: '8px 0' }} />
                  <div className={`${styles.summaryRow} ${styles.total}`}>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
                <div className={styles.actions}>
                  <Link to="/cart" className="btn btn-outline" style={{ flex: 1 }} onClick={onClose}>
                    View Cart
                  </Link>
                  <Link to="/checkout" className="btn btn-primary" style={{ flex: 1 }} onClick={onClose}>
                    Checkout
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
