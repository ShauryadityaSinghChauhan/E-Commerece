import styles from './Filters.module.css';

const PRICE_RANGES = [
  { label: 'All Prices', value: '' },
  { label: '$0 – $100', value: '0-100' },
  { label: '$100 – $500', value: '100-500' },
  { label: '$500 – $1000', value: '500-1000' },
  { label: '$1000+', value: '1000+' },
];

const SORT_OPTIONS = [
  { label: 'Default', value: '' },
  { label: 'Price: Low → High', value: 'price-asc' },
  { label: 'Price: High → Low', value: 'price-desc' },
  { label: 'Highest Rating', value: 'rating' },
  { label: 'Newest', value: 'newest' },
];

const Filters = ({
  categories,
  activeCategory,
  onCategoryChange,
  priceRange,
  onPriceRangeChange,
  sortBy,
  onSortChange,
}) => {
  return (
    <aside className={styles.sidebar}>
      {/* Category Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Categories</h3>
        <ul className={styles.categoryList}>
          <li>
            <button
              className={`${styles.categoryBtn} ${activeCategory === '' ? styles.active : ''}`}
              onClick={() => onCategoryChange('')}
            >
              All Products
            </button>
          </li>
          {categories.map((cat) => (
            <li key={cat}>
              <button
                className={`${styles.categoryBtn} ${activeCategory === cat ? styles.active : ''}`}
                onClick={() => onCategoryChange(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <hr className="divider" />

      {/* Price Filter */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Price Range</h3>
        <div className={styles.optionGroup}>
          {PRICE_RANGES.map(({ label, value }) => (
            <label key={value} className={styles.radioLabel}>
              <input
                type="radio"
                name="priceRange"
                value={value}
                checked={priceRange === value}
                onChange={() => onPriceRangeChange(value)}
                className={styles.radio}
              />
              <span className={styles.radioCustom} />
              {label}
            </label>
          ))}
        </div>
      </div>

      <hr className="divider" />

      {/* Sort */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Sort By</h3>
        <select
          className={styles.select}
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          id="sort-select"
        >
          {SORT_OPTIONS.map(({ label, value }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>
    </aside>
  );
};

export default Filters;
