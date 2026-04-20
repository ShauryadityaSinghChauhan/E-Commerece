import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag } from 'react-icons/fi';
import useWishlist from '../../hooks/useWishlist';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import EmptyState from '../../components/EmptyState/EmptyState';
import styles from './Wishlist.module.css';

const Wishlist = () => {
  const { wishlistItems } = useWishlist();

  return (
    <div className="page-wrapper">
      <div className="container">
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div>
            <h1 className="section-title">My Wishlist</h1>
            <p className="section-subtitle">
              {wishlistItems.length === 0
                ? 'Save your favourite products here'
                : `${wishlistItems.length} saved item(s)`}
            </p>
          </div>
        </motion.div>

        {wishlistItems.length === 0 ? (
          <EmptyState
            icon={<FiHeart />}
            title="Your wishlist is empty"
            description="Start building your wishlist by clicking the heart icon on any product you love."
            action={
              <Link to="/products" className="btn btn-primary">
                <FiShoppingBag size={14} /> Explore Products
              </Link>
            }
          />
        ) : (
          <ProductGrid products={wishlistItems} />
        )}
      </div>
    </div>
  );
};

export default Wishlist;
