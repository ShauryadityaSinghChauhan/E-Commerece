import { AnimatePresence } from 'framer-motion';
import ProductCard from '../ProductCard/ProductCard';
import EmptyState from '../EmptyState/EmptyState';
import { FiPackage } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, loading, onQuickView }) => {
  if (!loading && products.length === 0) {
    return (
      <EmptyState
        icon={<FiPackage />}
        title="No products found"
        description="Try adjusting your filters or search term to discover more products."
        action={
          <Link to="/products" className="btn btn-primary">
            Browse All Products
          </Link>
        }
      />
    );
  }

  return (
    <div className="product-grid">
      <AnimatePresence mode="wait">
        {products.map((product, i) => (
          <ProductCard
            key={product.id}
            product={product}
            index={i}
            onQuickView={onQuickView}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ProductGrid;
