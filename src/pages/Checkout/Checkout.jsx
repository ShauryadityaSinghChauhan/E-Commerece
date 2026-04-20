import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { toast } from 'react-toastify';
import { FiShoppingBag, FiCheck, FiLock } from 'react-icons/fi';
import useCart from '../../hooks/useCart';
import { formatPrice, calculateCartTotals } from '../../utils/helpers';
import styles from './Checkout.module.css';

// ── Yup Schema ──────────────────────────────────────────────────────────────
const schema = yup.object({
  name: yup.string().min(2, 'Name must be at least 2 characters').required('Full name is required'),
  email: yup.string().email('Enter a valid email').required('Email is required'),
  address: yup.string().min(5, 'Please enter a full address').required('Address is required'),
  city: yup.string().min(2, 'City is required').required('City is required'),
  zip: yup
    .string()
    .matches(/^\d{4,6}$/, 'Enter a valid ZIP code (4–6 digits)')
    .required('ZIP code is required'),
  cardNumber: yup
    .string()
    .matches(/^\d{16}$/, 'Card number must be 16 digits')
    .required('Card number is required'),
  expiry: yup
    .string()
    .matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Enter in MM/YY format')
    .required('Expiry is required'),
  cvv: yup
    .string()
    .matches(/^\d{3,4}$/, 'CVV must be 3–4 digits')
    .required('CVV is required'),
});

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, clearCart } = useCart();
  const { subtotal, tax, total } = calculateCartTotals(cartItems);
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(schema) });

  if (cartItems.length === 0 && !success) {
    return (
      <div className="page-wrapper">
        <div className="container" style={{ textAlign: 'center', padding: '80px 0' }}>
          <FiShoppingBag size={64} style={{ color: 'var(--text-muted)', marginBottom: 20 }} />
          <h2 className="section-title">Cart is empty</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>
            Shop Now
          </Link>
        </div>
      </div>
    );
  }

  const onSubmit = async (data) => {
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1200));
    clearCart();
    setSuccess(true);
    toast.success('🎉 Order placed successfully! Thank you for shopping with ShopVerse.', {
      autoClose: 5000,
    });
  };

  if (success) {
    return (
      <div className="page-wrapper">
        <div className="container">
          <motion.div
            className={styles.successCard}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
          >
            <div className={styles.successIcon}>
              <FiCheck size={40} />
            </div>
            <h2 className={styles.successTitle}>Order Confirmed!</h2>
            <p className={styles.successDesc}>
              Your order has been placed successfully. You'll receive an email confirmation shortly.
            </p>
            <div className={styles.successActions}>
              <Link to="/products" className="btn btn-primary">Continue Shopping</Link>
              <Link to="/" className="btn btn-outline">Go Home</Link>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ marginBottom: 32 }}
        >
          <h1 className="section-title">Checkout</h1>
          <p className="section-subtitle">Complete your purchase securely</p>
        </motion.div>

        <div className={styles.layout}>
          {/* Form */}
          <motion.form
            className={styles.form}
            onSubmit={handleSubmit(onSubmit)}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            {/* Shipping */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>📦 Shipping Information</h3>
              <div className={styles.formGrid}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="name">Full Name</label>
                  <input id="name" className="input" placeholder="John Doe" {...register('name')} />
                  {errors.name && <p className="form-error">{errors.name.message}</p>}
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="email">Email Address</label>
                  <input id="email" type="email" className="input" placeholder="john@example.com" {...register('email')} />
                  {errors.email && <p className="form-error">{errors.email.message}</p>}
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="address">Street Address</label>
                  <input id="address" className="input" placeholder="123 Main Street, Apt 4B" {...register('address')} />
                  {errors.address && <p className="form-error">{errors.address.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="city">City</label>
                  <input id="city" className="input" placeholder="New York" {...register('city')} />
                  {errors.city && <p className="form-error">{errors.city.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="zip">ZIP Code</label>
                  <input id="zip" className="input" placeholder="10001" {...register('zip')} />
                  {errors.zip && <p className="form-error">{errors.zip.message}</p>}
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className={styles.section}>
              <h3 className={styles.sectionTitle}>💳 Payment Details</h3>
              <div className={styles.secureNote}>
                <FiLock size={14} /> All transactions are secure and encrypted
              </div>
              <div className={styles.formGrid}>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label className="form-label" htmlFor="cardNumber">Card Number</label>
                  <input
                    id="cardNumber"
                    className="input"
                    placeholder="1234 5678 9012 3456"
                    maxLength={16}
                    {...register('cardNumber')}
                  />
                  {errors.cardNumber && <p className="form-error">{errors.cardNumber.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="expiry">Expiry (MM/YY)</label>
                  <input id="expiry" className="input" placeholder="09/27" {...register('expiry')} />
                  {errors.expiry && <p className="form-error">{errors.expiry.message}</p>}
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="cvv">CVV</label>
                  <input id="cvv" className="input" placeholder="123" maxLength={4} {...register('cvv')} />
                  {errors.cvv && <p className="form-error">{errors.cvv.message}</p>}
                </div>
              </div>
            </div>

            <button
              type="submit"
              className={`btn btn-primary ${styles.submitBtn}`}
              disabled={isSubmitting}
              id="checkout-submit"
            >
              {isSubmitting ? (
                <span className={styles.submitLoader} />
              ) : (
                <>
                  <FiLock size={16} />
                  Place Order · {formatPrice(subtotal < 50 ? total + 5.99 : total)}
                </>
              )}
            </button>
          </motion.form>

          {/* Order Summary */}
          <motion.aside
            className={styles.summary}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <div className={styles.summaryCard}>
              <h3 className={styles.sectionTitle}>🛒 Order Summary</h3>
              <div className={styles.itemList}>
                {cartItems.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <img
                      src={item.image}
                      alt={item.title}
                      className={styles.itemImg}
                    />
                    <div className={styles.itemMeta}>
                      <p className={styles.itemName}>{item.title}</p>
                      <p className={styles.itemQty}>Qty: {item.quantity}</p>
                    </div>
                    <span className={styles.itemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <hr className="divider" />
              <div className={styles.rows}>
                <div className={styles.row}>
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.row}>
                  <span>Shipping</span>
                  <span style={{ color: 'var(--success)', fontWeight: 700 }}>
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
            </div>
          </motion.aside>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
