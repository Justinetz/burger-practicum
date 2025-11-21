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
        <div className={styles.menu_part_left}>
          <NavLink
            to={appRoutes.main}
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
          >
            <BurgerIcon type={pathname === '/' ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Конструктор</p>
          </NavLink>
        </div>
        <div className={styles.logo}>
          <NavLink
            to={appRoutes.main}
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
          >
            <Logo />
          </NavLink>
        </div>
        <div className={styles.link_container_right}>
          <NavLink
            to={appRoutes.profileOrders}
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''}`}
          >
            <ListIcon type={pathname === appRoutes.profileOrders ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">История заказов</p>
          </NavLink>
          <NavLink
            to={appRoutes.profile}
            end
            className={({ isActive }) => `${styles.link} ${isActive ? styles.link_active : ''} `}
          >
            <ProfileIcon type={pathname === appRoutes.profile ? 'primary' : 'secondary'} />
            <p className="text text_type_main-default ml-2">Личный кабинет</p>
          </NavLink>
        </div>
      </nav>
    </header>
  );
};
