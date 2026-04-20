import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowRight, FiZap, FiShield, FiRefreshCw, FiTruck } from 'react-icons/fi';
import useProducts from '../../hooks/useProducts';
import { useCartContext } from '../../context/CartContext';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import QuickViewModal from '../../components/QuickViewModal/QuickViewModal';
import { ProductSkeleton } from '../../components/Loader/Loader';
import styles from './Home.module.css';

const FEATURES = [
  { icon: <FiZap />, title: 'Fast Delivery', desc: 'Lightning-fast shipping to your door.' },
  { icon: <FiShield />, title: 'Secure Payments', desc: 'Your data is always protected.' },
  { icon: <FiRefreshCw />, title: 'Easy Returns', desc: '30-day hassle-free return policy.' },
  { icon: <FiTruck />, title: 'Free Shipping', desc: 'On all orders over $50.' },
];

const CATEGORIES = [
  { slug: 'smartphones', emoji: '📱', label: 'Smartphones' },
  { slug: 'laptops', emoji: '💻', label: 'Laptops' },
  { slug: 'mens-shirts', emoji: '👔', label: "Men's Fashion" },
  { slug: 'womens-dresses', emoji: '👗', label: "Women's Fashion" },
  { slug: 'beauty', emoji: '💄', label: 'Beauty' },
  { slug: 'furniture', emoji: '🛋️', label: 'Furniture' },
];

const Home = () => {
  const { products, loading } = useProducts();
  const { recentlyViewed } = useCartContext();
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const featured = products.slice(0, 6);

  return (
    <div className={styles.page}>
      {/* ── Hero ── */}
      <section className={styles.hero}>
        <div className={`container ${styles.heroInner}`}>
          <motion.div
            className={styles.heroText}
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
          >
            <span className={styles.heroBadge}>✨ New Collection 2024</span>
            <h1 className={styles.heroTitle}>
              Discover <br />
              <span className={styles.heroAccent}>Premium</span> Products
            </h1>
            <p className={styles.heroDesc}>
              Explore thousands of curated products — from cutting-edge electronics to
              timeless fashion staples. Shop smarter, live better.
            </p>
            <div className={styles.heroCta}>
              <Link to="/products" className="btn btn-primary" id="hero-shop-now">
                Shop Now <FiArrowRight size={16} />
              </Link>
              <Link to="/products" className="btn btn-outline">
                View Categories
              </Link>
            </div>
            <div className={styles.heroStats}>
              <div className={styles.stat}><strong>5K+</strong><span>Products</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><strong>120K+</strong><span>Customers</span></div>
              <div className={styles.statDivider} />
              <div className={styles.stat}><strong>4.8★</strong><span>Rating</span></div>
            </div>
          </motion.div>

          <motion.div
            className={styles.heroVisual}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
          >
            <div className={styles.heroCard}>
              <div className={styles.heroGlow} />
              <img
                src="https://cdn.dummyjson.com/product-images/smartphones/samsung-galaxy-s23-ultra/1.webp"
                alt="Featured Product"
                className={styles.heroImg}
              />
              <div className={styles.heroBubble1}>Electronics</div>
              <div className={styles.heroBubble2}>🔥 Best Seller</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className={styles.features}>
        <div className="container">
          <div className={styles.featuresGrid}>
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                className={styles.featureCard}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <div className={styles.featureIcon}>{f.icon}</div>
                <div>
                  <h4 className={styles.featureTitle}>{f.title}</h4>
                  <p className={styles.featureDesc}>{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className={styles.section}>
        <div className="container">
          <h2 className="section-title">Shop by Category</h2>
          <p className="section-subtitle">Find exactly what you're looking for</p>
          <div className={styles.categoriesGrid}>
            {CATEGORIES.map((cat, i) => (
              <motion.div
                key={cat.slug}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -6 }}
              >
                <Link
                  to={`/products?category=${encodeURIComponent(cat.slug)}`}
                  className={styles.categoryCard}
                  id={`category-${cat.slug.replace(/[^a-z]/g, '-')}`}
                >
                  <span className={styles.categoryEmoji}>{cat.emoji}</span>
                  <span className={styles.categoryLabel}>{cat.label}</span>
                  <FiArrowRight size={14} className={styles.categoryArrow} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className={styles.section}>
        <div className="container">
          <div className={styles.sectionHeader}>
            <div>
              <h2 className="section-title">Featured Products</h2>
              <p className="section-subtitle">Our most popular picks, curated for you</p>
            </div>
            <Link to="/products" className="btn btn-outline">
              View All <FiArrowRight size={14} />
            </Link>
          </div>
          {loading ? (
            <ProductSkeleton count={6} />
          ) : (
            <ProductGrid products={featured} onQuickView={setQuickViewProduct} />
          )}
        </div>
      </section>

      {/* ── Recently Viewed ── */}
      {recentlyViewed.length > 0 && (
        <section className={styles.section}>
          <div className="container">
            <h2 className="section-title">Recently Viewed</h2>
            <p className="section-subtitle">Pick up where you left off</p>
            <ProductGrid products={recentlyViewed.slice(0, 3)} onQuickView={setQuickViewProduct} />
          </div>
        </section>
      )}

      {/* Quick View */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Home;
