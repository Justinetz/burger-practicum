import { NavLink } from 'react-router-dom';

import { useAppDispatch } from '../../hooks/use-dispatch';
import { logout } from '../../services/user/user-reducer';
import { appRoutes } from '../../utils/constants';

import type { JSX } from 'react';
import type React from 'react';
import type { To } from 'react-router-dom';

import styles from './profile-menu.module.css';

export const ProfileMenu = (): React.ReactElement => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  const getLinkContent = (routeTo: To, text: string): JSX.Element => {
    return (
      <NavLink to={routeTo} end className={styles.link}>
        {({ isActive }) => (
          <p className={`${styles.link_text} pb-2 ${isActive ? styles.link_text_active : ''}`}>{text}</p>
        )}
      </NavLink>
    );
  };

  return (
    <aside className={`${styles.side_root} mr-15`}>
      <ul className={styles.side_tabs}>
        <li>{getLinkContent(appRoutes.profile, 'Профиль')}</li>
        <li>{getLinkContent(appRoutes.profileOrders, 'История заказов')}</li>
        <li>
          <button onClick={onLogout} className={`${styles.button} text text_type_main-medium text_color_inactive pb-4`}>
            Выход
          </button>
        </li>
      </ul>
      <p className={`${styles.info} text text_type_main-default text_color_inactive mt-20`}>
        В этом разделе вы можете изменить свои персональные данные
      </p>
    </aside>
  );
};
