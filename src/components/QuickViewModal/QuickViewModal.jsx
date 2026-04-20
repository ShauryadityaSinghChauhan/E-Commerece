import { AnimatePresence, motion } from 'framer-motion';
import { FiX, FiShoppingCart, FiHeart } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCartContext } from '../../context/CartContext';
import StarRating from '../StarRating/StarRating';
import { formatPrice, truncateText } from '../../utils/helpers';
import styles from './QuickViewModal.module.css';

const QuickViewModal = ({ product, onClose }) => {
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartContext();

  if (!product) return null;

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product);
    toast.success('Added to cart!');
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast(inWishlist ? 'Removed from wishlist' : '❤️ Added to wishlist!');
  };

  return (
    <AnimatePresence>
      {product && (
        <motion.div
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="modal"
            initial={{ scale: 0.88, opacity: 0, y: 30 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.88, opacity: 0, y: 30 }}
            transition={{ type: 'spring', damping: 24, stiffness: 260 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className={styles.inner}>
              {/* Image */}
              <div className={styles.imgCol}>
                <img src={product.thumbnail} alt={product.title} className={styles.img} />
                <span className="badge">{product.category}</span>
              </div>

              {/* Info */}
              <div className={styles.infoCol}>
                <button className={styles.closeBtn} onClick={onClose}>
                  <FiX size={18} />
                </button>
                <span className="badge" style={{ marginBottom: 8 }}>{product.category}</span>
                <h2 className={styles.title}>{product.title}</h2>
                <StarRating
                  rating={product.rating}
                  count={product.reviews?.length}
                  size={15}
                />
                <p className={styles.price}>{formatPrice(product.price)}</p>
                <p className={styles.desc}>{truncateText(product.description, 200)}</p>

                <div className={styles.actions}>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className={`btn btn-primary ${styles.actionBtn}`}
                    onClick={handleAddToCart}
                  >
                    <FiShoppingCart size={16} />
                    {inCart ? 'In Cart' : 'Add to Cart'}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    className={`btn btn-outline ${styles.wishBtn} ${inWishlist ? styles.wishlisted : ''}`}
                    onClick={handleWishlist}
                  >
                    <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
                  </motion.button>
                </div>

                <Link
                  to={`/products/${product.id}`}
                  className={styles.detailLink}
                  onClick={onClose}
                >
                  View Full Details →
                </Link>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default QuickViewModal;
