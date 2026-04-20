import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { FiShoppingCart, FiHeart, FiArrowLeft } from 'react-icons/fi';
import { toast } from 'react-toastify';
import { fetchProductById, fetchProductsByCategory } from '../../services/api';
import { useCartContext } from '../../context/CartContext';
import StarRating from '../../components/StarRating/StarRating';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import { ProductSkeleton, Spinner } from '../../components/Loader/Loader';
import { formatPrice } from '../../utils/helpers';
import styles from './ProductDetails.module.css';

const ProductDetails = () => {
  const { id } = useParams();
  const { addToCart, toggleWishlist, isInCart, isInWishlist, addRecentlyViewed } = useCartContext();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      try {
        const res = await fetchProductById(id);
        setProduct(res.data);
        addRecentlyViewed(res.data);

        // Load related products from same category
        const relRes = await fetchProductsByCategory(res.data.category);
        const relList = relRes.data?.products ?? relRes.data;
        setRelated(relList.filter((p) => p.id !== res.data.id).slice(0, 4));
      } catch (e) {
        setError('Product not found.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="page-wrapper"><div className="container"><Spinner size={48} /></div></div>;
  if (error || !product) return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ textAlign: 'center', padding: '80px 0' }}>
          <h2>Product not found</h2>
          <Link to="/products" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Products</Link>
        </div>
      </div>
    </div>
  );

  const inCart = isInCart(product.id);
  const inWishlist = isInWishlist(product.id);

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    toast.success(`${qty}× "${product.title.substring(0, 30)}…" added to cart!`);
  };

  const handleWishlist = () => {
    toggleWishlist(product);
    toast(inWishlist ? 'Removed from wishlist' : '❤️ Saved to wishlist!');
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <Link to="/products" className={styles.back}>
            <FiArrowLeft size={14} /> All Products
          </Link>
          <span className={styles.breadSep}>/</span>
          <span className={styles.breadCat}>{product.category}</span>
        </div>

        {/* Main grid */}
        <motion.div
          className={styles.grid}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* ── Image Gallery ── */}
          <div className={styles.gallery}>
            <div className={styles.swiperWrap}>
              <Swiper
                modules={[Navigation, Pagination]}
                navigation
                pagination={{ clickable: true }}
                className={styles.swiper}
              >
                {/* DummyJSON provides a real images array */}
                {(product.images?.length ? product.images : [product.thumbnail]).map((img, i) => (
                  <SwiperSlide key={i}>
                    <div className={styles.slideWrap}>
                      <img src={img} alt={`${product.title} ${i + 1}`} className={styles.mainImg} />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>

          {/* ── Info ── */}
          <div className={styles.info}>
            <span className="badge">{product.category}</span>

            <h1 className={styles.title}>{product.title}</h1>

            <div className={styles.ratingRow}>
              <StarRating
                rating={product.rating}
                count={product.reviews?.length}
                size={16}
              />
              <span className={styles.ratingText}>
                {product.rating} / 5 · {product.reviews?.length ?? 0} reviews
              </span>
            </div>

            <p className={styles.price}>{formatPrice(product.price)}</p>

            <hr className="divider" />

            <p className={styles.desc}>{product.description}</p>

            <hr className="divider" />

            {/* Quantity */}
            <div className={styles.qtyRow}>
              <span className={styles.qtyLabel}>Quantity</span>
              <div className={styles.qtyControl}>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  disabled={qty <= 1}
                >–</button>
                <span className={styles.qtyNum}>{qty}</span>
                <button
                  className={styles.qtyBtn}
                  onClick={() => setQty((q) => q + 1)}
                >+</button>
              </div>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
              <motion.button
                whileTap={{ scale: 0.97 }}
                className={`btn btn-primary ${styles.addBtn}`}
                onClick={handleAddToCart}
                id="product-detail-add-cart"
              >
                <FiShoppingCart size={18} />
                {inCart ? 'Add More' : 'Add to Cart'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                className={`btn btn-outline ${styles.wishBtn} ${inWishlist ? styles.wishlisted : ''}`}
                onClick={handleWishlist}
                id="product-detail-wishlist"
              >
                <FiHeart size={18} fill={inWishlist ? 'currentColor' : 'none'} />
                {inWishlist ? 'Saved' : 'Wishlist'}
              </motion.button>
            </div>

            {/* Trust badges */}
            <div className={styles.trustBadges}>
              <span>🔒 Secure checkout</span>
              <span>📦 Free shipping over $50</span>
              <span>↩️ 30-day returns</span>
            </div>
          </div>
        </motion.div>

        {/* Related Products */}
        {related.length > 0 && (
          <section className={styles.related}>
            <h2 className="section-title">Related Products</h2>
            <p className="section-subtitle">More from {product.category}</p>
            <ProductGrid products={related} />
          </section>
        )}
      </div>
    </div>
  );
};

export default ProductDetails;
