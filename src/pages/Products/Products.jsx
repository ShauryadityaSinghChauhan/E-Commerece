import { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import useProducts from '../../hooks/useProducts';
import useDebounce from '../../hooks/useDebounce';
import ProductGrid from '../../components/ProductGrid/ProductGrid';
import Filters from '../../components/Filters/Filters';
import SearchBar from '../../components/SearchBar/SearchBar';
import QuickViewModal from '../../components/QuickViewModal/QuickViewModal';
import { ProductSkeleton } from '../../components/Loader/Loader';
import { filterByPriceRange, sortProducts } from '../../utils/helpers';
import styles from './Products.module.css';

const ITEMS_PER_PAGE = 9;

const Products = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [priceRange, setPriceRange] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const debouncedSearch = useDebounce(searchInput, 400);

  const { products, categories, loading, error } = useProducts(activeCategory);

  // Sync URL params → state
  useEffect(() => {
    const cat = searchParams.get('category') || '';
    const s = searchParams.get('search') || '';
    setActiveCategory(cat);
    setSearchInput(s);
  }, [searchParams]);

  // Filter + Sort pipeline
  const processed = useMemo(() => {
    let list = [...products];

    // Search filter
    if (debouncedSearch.trim()) {
      const q = debouncedSearch.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    // Price filter
    list = filterByPriceRange(list, priceRange);

    // Sort
    list = sortProducts(list, sortBy);

    return list;
  }, [products, debouncedSearch, priceRange, sortBy]);

  // Pagination
  const totalPages = Math.ceil(processed.length / ITEMS_PER_PAGE);
  const paginated = processed.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  // Reset to page 1 when filters change
  useEffect(() => { setPage(1); }, [debouncedSearch, activeCategory, priceRange, sortBy]);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setSearchParams(cat ? { category: cat } : {});
  };

  return (
    <div className="page-wrapper">
      <div className="container"> 
        {/* ── Page Header ── */}
        <motion.div
          className={styles.header}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div>
            <h1 className="section-title">All Products</h1>
            <p className="section-subtitle">
              {loading ? 'Loading…' : `${processed.length} products found`}
            </p>
          </div>
          <div className={styles.searchWrap}>
            <SearchBar
              value={searchInput}
              onChange={setSearchInput}
              placeholder="Search products..."
            />
          </div>
        </motion.div>

        {/* Category tabs (mobile-friendly horizontal scroll) */}
        <div className={styles.tabs}>
          <button
            className={`${styles.tab} ${activeCategory === '' ? styles.activeTab : ''}`}
            onClick={() => handleCategoryChange('')}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              className={`${styles.tab} ${activeCategory === cat ? styles.activeTab : ''}`}
              onClick={() => handleCategoryChange(cat)}
            >
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </button>
          ))}
        </div>

        {/* ── Main layout ── */}
        <div className={styles.layout}>
          {/* Sidebar */}
          <Filters
            categories={categories}
            activeCategory={activeCategory}
            onCategoryChange={handleCategoryChange}
            priceRange={priceRange}
            onPriceRangeChange={setPriceRange}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {/* Products */}
          <main className={styles.main}>
            {error && (
              <div className={styles.error}>
                ⚠️ Failed to load products. Please try again.
              </div>
            )}

            {loading ? (
              <ProductSkeleton count={ITEMS_PER_PAGE} />
            ) : (
              <>
                <ProductGrid
                  products={paginated}
                  onQuickView={setQuickViewProduct}
                />

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="pagination">
                    <button
                      className="pagination-btn"
                      disabled={page === 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      ‹
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        className={`pagination-btn ${p === page ? 'active' : ''}`}
                        onClick={() => setPage(p)}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      className="pagination-btn"
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      ›
                    </button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>

      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
      />
    </div>
  );
};

export default Products;
