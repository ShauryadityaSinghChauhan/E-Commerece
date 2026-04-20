import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import CartItem from '../../components/CartItem/CartItem';
import EmptyState from '../../components/EmptyState/EmptyState';
import { formatPrice, calculateCartTotals } from '../../utils/helpers';
import styles from './Cart.module.css';

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();
  const { subtotal, tax, total } = calculateCartTotals(cartItems);

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Header */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="section-title">Shopping Cart</h1>
            <p className="section-subtitle">{cartItems.length} item(s) in your cart</p>
          </div>
          {cartItems.length > 0 && (
            <button
              className="btn btn-danger"
              onClick={clearCart}
              id="cart-clear-all"
            >
              <FiTrash2 size={14} /> Clear All
            </button>
          )}
        </motion.div>

        {cartItems.length === 0 ? (
          <EmptyState
            icon={<FiShoppingCart />}
            title="Your cart is empty"
            description="Looks like you haven't added anything yet. Browse our products and start shopping!"
            action={
              <Link to="/products" className="btn btn-primary">
                <FiArrowLeft size={14} /> Browse Products
              </Link>
            }
          />
        ) : (
          <div className={styles.layout}>
            {/* Items */}
            <div className={styles.items}>
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

            {/* Summary */}
            <aside className={styles.summary}>
              <div className={styles.summaryCard}>
                <h3 className={styles.summaryTitle}>Order Summary</h3>

                <div className={styles.rows}>
                  <div className={styles.row}>
                    <span>Subtotal ({cartItems.reduce((s, i) => s + i.quantity, 0)} items)</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className={styles.row}>
                    <span>Shipping</span>
                    <span className={styles.free}>
                      {subtotal >= 50 ? 'Free' : formatPrice(5.99)}
                    </span>
                  </div>
                  <div className={styles.row}>
                    <span>Tax (10%)</span>
                    <span>{formatPrice(tax)}</span>
                  </div>
                </div>

                <hr className="divider" />

                <div className={`${styles.row} ${styles.totalRow}`}>
                  <span>Total</span>
                  <span>{formatPrice(subtotal < 50 ? total + 5.99 : total)}</span>
                </div>

                {subtotal < 50 && (
                  <p className={styles.freeShippingNote}>
                    Add {formatPrice(50 - subtotal)} more for free shipping!
                  </p>
                )}

                <Link to="/checkout" className={`btn btn-primary ${styles.checkoutBtn}`} id="cart-checkout">
                  Proceed to Checkout
                </Link>
                <Link to="/products" className={`btn btn-ghost ${styles.continueBtn}`}>
                  ← Continue Shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
