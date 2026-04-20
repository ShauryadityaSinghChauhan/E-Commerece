import { memo } from 'react';
import { FiStar } from 'react-icons/fi';
import { getRatingStars } from '../../utils/helpers';

const StarRating = memo(({ rating, count, size = 14 }) => {
  const stars = getRatingStars(rating);

  return (
    <div className="stars" style={{ fontSize: size, gap: 2 }}>
      {stars.map((type, i) => (
        <span
          key={i}
          style={{
            color: type === 'empty' ? 'var(--border)' : 'var(--warning)',
            filter: type === 'full' ? 'drop-shadow(0 0 2px rgba(245,158,11,0.5))' : 'none',
          }}
        >
          ★
        </span>
      ))}
      {count !== undefined && (
        <span style={{ fontSize: size - 2, color: 'var(--text-muted)', marginLeft: 4, fontWeight: 500 }}>
          ({count})
        </span>
      )}
    </div>
  );
});

StarRating.displayName = 'StarRating';
export default StarRating;
