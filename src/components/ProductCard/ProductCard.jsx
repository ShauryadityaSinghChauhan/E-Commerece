import { memo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { useCartContext } from '../../context/CartContext';
import StarRating from '../StarRating/StarRating';
import { formatPrice, truncateText } from '../../utils/helpers';
import styles from './ProductCard.module.css';

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

const ProductCard = memo(({ product, onQuickView, index = 0 }) => {
  const { addToCart, toggleWishlist, isInCart, isInWishlist } = useCartContext();
  const [imgLoaded, setImgLoaded] = useState(false);

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.preventDefault();
    addToCart(product);
    toast.success(
      <div className={styles.toast}>
        <img src={product.thumbnail} alt={product.title} className={styles.toastImg} />
        <div>
          <strong>Added to cart!</strong>
          <p>{truncateText(product.title, 40)}</p>
        </div>
      </div>,
      { icon: false }
    );
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast(inWishlist ? 'Removed from wishlist' : '❤️ Added to wishlist!', {
      type: inWishlist ? 'default' : 'success',
    });
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -6 }}
      className={styles.card}
    >
      <Link to={`/products/${product.id}`} className={styles.link}>
        {/* Image Area */}
        <div className={styles.imageWrap}>
          {!imgLoaded && <div className={`skeleton ${styles.imgPlaceholder}`} />}
          <img
            src={product.thumbnail}
            alt={product.title}
            className={`${styles.image} ${imgLoaded ? styles.imgVisible : ''}`}
            onLoad={() => setImgLoaded(true)}
            loading="lazy"
          />

          {/* Overlay actions */}
          <div className={styles.overlay}>
            <motion.button
              whileTap={{ scale: 0.9 }}
              className={`${styles.overlayBtn} ${inWishlist ? styles.wishlisted : ''}`}
              onClick={handleWishlist}
              title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
            >
              <FiHeart size={16} fill={inWishlist ? 'currentColor' : 'none'} />
            </motion.button>
            {onQuickView && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                className={styles.overlayBtn}
                onClick={(e) => { e.preventDefault(); onQuickView(product); }}
                title="Quick view"
              >
                <FiEye size={16} />
              </motion.button>
            )}
          </div>

          {/* Category badge */}
          <span className={styles.categoryBadge}>
            {product.category}
          </span>
        </div>

        {/* Info */}
        <div className={styles.info}>
          <StarRating rating={product.rating} count={product.reviews?.length} size={13} />
          <h3 className={styles.title}>{truncateText(product.title, 55)}</h3>
          <div className={styles.footer}>
            <span className={styles.price}>{formatPrice(product.price)}</span>
            <motion.button
              whileTap={{ scale: 0.95 }}
              className={`${styles.cartBtn} ${inCart ? styles.inCart : ''}`}
              onClick={handleAddToCart}
            >
              <FiShoppingCart size={14} />
              {inCart ? 'In Cart' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
