import { motion } from 'framer-motion';
import styles from './EmptyState.module.css';

const EmptyState = ({ icon, title, description, action }) => (
  <motion.div
    className={styles.wrapper}
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className={styles.iconWrap}>{icon}</div>
    <h3 className={styles.title}>{title}</h3>
    <p className={styles.desc}>{description}</p>
    {action && <div className={styles.action}>{action}</div>}
  </motion.div>
);

export default EmptyState;
