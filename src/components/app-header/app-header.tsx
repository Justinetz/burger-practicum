import { BurgerIcon, ListIcon, Logo, ProfileIcon } from '@krgaa/react-developer-burger-ui-components';
import { NavLink } from 'react-router-dom';

import { appRoutes } from '../../utils/constants';

import type { JSX } from 'react';
import type { To } from 'react-router-dom';

import styles from './app-header.module.css';

/**
 * Шапка приложения.
 */
export const AppHeader = (): React.JSX.Element => {
  const getLinkContent = (routeTo: To, text: string, getIcon: (isActive: boolean) => JSX.Element) => {
    return (
      <NavLink to={routeTo} end className={styles.link}>
        {({ isActive }) => (
          <div className={`${styles.link_content} ${isActive ? styles.link_content_active : ''}`}>
            {getIcon(isActive)}
            <p className="text text_type_main-default ml-2">{text}</p>
          </div>
        )}
      </NavLink>
    );
  };

  return (
    <header className={styles.header}>
      <nav className={`${styles.menu} p-4`}>
        <div className={styles.link_container_left}>
          {getLinkContent(appRoutes.main, 'Конструктор', (isActive: boolean) => (
            <BurgerIcon type={isActive ? 'primary' : 'secondary'} />
          ))}
          {getLinkContent(appRoutes.feed, 'Лента заказов', (isActive: boolean) => (
            <ListIcon type={isActive ? 'primary' : 'secondary'} />
          ))}
        </div>
        <div className={styles.logo}>
          <NavLink to={appRoutes.main} end>
            <Logo />
          </NavLink>
        </div>
        <div className={styles.link_container_right}>
          {getLinkContent(appRoutes.profile, 'Личный кабинет', (isActive: boolean) => (
            <ProfileIcon type={isActive ? 'primary' : 'secondary'} />
          ))}
        </div>
      </nav>
    </header>
  );
};
