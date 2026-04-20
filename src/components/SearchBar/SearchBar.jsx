import { FiSearch, FiX } from 'react-icons/fi';
import styles from './SearchBar.module.css';

const SearchBar = ({ value, onChange, placeholder = 'Search products...' }) => (
  <div className={styles.wrapper}>
    <FiSearch className={styles.icon} size={18} />
    <input
      id="product-search"
      className={styles.input}
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      aria-label="Search products"
    />
    {value && (
      <button
        className={styles.clear}
        onClick={() => onChange('')}
        aria-label="Clear search"
      >
        <FiX size={16} />
      </button>
    )}
  </div>
);

export default SearchBar;
