import styles from './Navbar.module.scss';

import { NavLink } from 'react-router-dom';

const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <NavLink reloadDocument to='/' className={styles.navbar__brand}>
        Verily Vision
      </NavLink>
    </div>
  );
};

export default Navbar;
