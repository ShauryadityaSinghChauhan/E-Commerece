import styles from './Loader.module.css';

// Full-page skeleton loader for product grids
export const ProductSkeleton = ({ count = 6 }) => (
  <div className="product-grid">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={styles.skeletonCard}>
        <div className={`skeleton ${styles.skeletonImg}`} />
        <div className={styles.skeletonBody}>
          <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '60%', height: 12 }} />
          <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '90%', height: 16 }} />
          <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '40%', height: 20 }} />
          <div className={`skeleton ${styles.skeletonLine}`} style={{ width: '100%', height: 38, borderRadius: 10 }} />
        </div>
      </div>
    ))}
  </div>
);

// Spinner loader
export const Spinner = ({ size = 40 }) => (
  <div className={styles.spinnerWrap}>
    <div className={styles.spinner} style={{ width: size, height: size }} />
  </div>
);

export default Spinner;
