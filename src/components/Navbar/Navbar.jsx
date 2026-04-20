import { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiShoppingCart, FiHeart, FiSun, FiMoon,
  FiMenu, FiX, FiSearch, FiPackage
} from 'react-icons/fi';
import { useCartContext } from '../../context/CartContext';
import CartDrawer from '../CartDrawer/CartDrawer';
import styles from './Navbar.module.css';

const NAV_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/products', label: 'Products' },
  { to: '/wishlist', label: 'Wishlist' },
];

const Navbar = () => {
  const { cartCount, wishlistItems, darkMode, toggleDarkMode } = useCartContext();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`container ${styles.inner}`}>
          {/* Logo */}
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}><FiPackage size={20} /></span>
            <span>Shop<strong>Verse</strong></span>
          </Link>

          {/* Desktop Nav */}
          <nav className={styles.desktopNav}>
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `${styles.navLink} ${isActive ? styles.active : ''}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>

          {/* Actions */}
          <div className={styles.actions}>
            {/* Search toggle */}
            <button
              className={styles.iconBtn}
              onClick={() => setSearchOpen((p) => !p)}
              aria-label="Toggle search"
              id="navbar-search-toggle"
            >
              <FiSearch size={18} />
            </button>

            {/* Dark mode */}
            <button
              className={styles.iconBtn}
              onClick={toggleDarkMode}
              aria-label="Toggle dark mode"
              id="dark-mode-toggle"
            >
              <motion.span
                key={darkMode ? 'moon' : 'sun'}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? <FiSun size={18} /> : <FiMoon size={18} />}
              </motion.span>
            </button>

            {/* Wishlist */}
            <Link to="/wishlist" className={styles.iconBtn} aria-label="Wishlist" id="navbar-wishlist">
              <FiHeart size={18} />
              {wishlistItems.length > 0 && (
                <motion.span
                  className={styles.badge}
                  key={wishlistItems.length}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  style={{ background: '#ef4444' }}
                >
                  {wishlistItems.length}
                </motion.span>
              )}
            </Link>

            {/* Cart */}
            <button
              className={`${styles.iconBtn} ${styles.cartBtn}`}
              onClick={() => setDrawerOpen(true)}
              aria-label="Open cart"
              id="navbar-cart"
            >
              <FiShoppingCart size={18} />
              {cartCount() > 0 && (
                <motion.span
                  className={styles.badge}
                  key={cartCount()}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {cartCount()}
                </motion.span>
              )}
            </button>

            {/* Mobile hamburger */}
            <button
              className={`${styles.iconBtn} ${styles.hamburger}`}
              onClick={() => setMobileOpen((p) => !p)}
              aria-label="Toggle menu"
            >
              {mobileOpen ? <FiX size={20} /> : <FiMenu size={20} />}
            </button>
          </div>
        </div>

        {/* Search Bar Drop-down */}
        <AnimatePresence>
          {searchOpen && (
            <motion.div
              className={styles.searchBar}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              <form onSubmit={handleSearch} className={`container ${styles.searchForm}`}>
                <FiSearch size={18} className={styles.searchIcon} />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={styles.searchInput}
                  autoFocus
                  id="navbar-search-input"
                />
                <button type="submit" className="btn btn-primary" style={{ padding: '8px 16px' }}>
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Nav */}
        <AnimatePresence>
          {mobileOpen && (
            <motion.nav
              className={styles.mobileNav}
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
            >
              {NAV_LINKS.map(({ to, label }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `${styles.mobileLink} ${isActive ? styles.active : ''}`
                  }
                  onClick={() => setMobileOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  `${styles.mobileLink} ${isActive ? styles.active : ''}`
                }
                onClick={() => setMobileOpen(false)}
              >
                Cart {cartCount() > 0 && `(${cartCount()})`}
              </NavLink>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
    </>
  );
};

export default Navbar;
