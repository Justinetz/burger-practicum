import { BurgerIcon, ListIcon, Logo, ProfileIcon } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { appRoutes } from '../../utils/constants';

import styles from './app-header.module.css';

/**
 * Шапка приложения.
 */
export const AppHeader = (): React.JSX.Element => {
  const location = useLocation();

  const pathname = useMemo(() => location.pathname, [location.pathname]);

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.link_container_left}>
          <NavLink to={appRoutes.main} end>
            {({ isActive }) => (
              <div className={`${styles.link} ${isActive ? styles.link_active : ''}`}>
                <BurgerIcon type={pathname === '/' ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Конструктор</p>
              </div>
            )}
          </NavLink>
          <NavLink to={appRoutes.feed} end>
            {({ isActive }) => (
              <div className={`${styles.link} ${isActive ? styles.link_active : ''}`}>
                <ListIcon type={pathname === appRoutes.feed ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Лента заказов</p>
              </div>
            )}
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink to={appRoutes.main} end>
            <Logo />
          </NavLink>
        </div>
        <div className={styles.link_container_right}>
          <NavLink to={appRoutes.profile} end>
            {({ isActive }) => (
              <div className={`${styles.link} ${isActive ? styles.link_active : ''}`}>
                <ProfileIcon type={pathname === appRoutes.profile ? 'primary' : 'secondary'} />
                <p className="text text_type_main-default ml-2">Личный кабинет</p>
              </div>
            )}
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
