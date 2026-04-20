import { motion } from 'framer-motion';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { formatPrice } from '../../utils/helpers';
import styles from './CartItem.module.css';

const CartItem = ({ item, onRemove, onQuantityChange }) => (
  <motion.div
    className={styles.item}
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 20 }}
    layout
  >
    <div className={styles.imgWrap}>
      <img src={item.thumbnail} alt={item.title} className={styles.img} />
    </div>

    <div className={styles.details}>
      <p className={styles.title}>{item.title}</p>
      <span className={styles.price}>{formatPrice(item.price)}</span>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
            disabled={item.quantity <= 1}
            className={styles.qtyBtn}
            aria-label="Decrease quantity"
          >
            <FiMinus size={12} />
          </button>
          <span className={styles.qtyNum}>{item.quantity}</span>
          <button
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
            className={styles.qtyBtn}
            aria-label="Increase quantity"
          >
            <FiPlus size={12} />
          </button>
        </div>

        <span className={styles.lineTotal}>
          {formatPrice(item.price * item.quantity)}
        </span>

        <button
          onClick={() => onRemove(item.id)}
          className={styles.deleteBtn}
          aria-label="Remove item"
        >
          <FiTrash2 size={14} />
        </button>
      </div>
    </div>
  </motion.div>
);

export default CartItem;
