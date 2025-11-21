import { NavLink } from 'react-router-dom';

import { ProfileEditor } from '../../components/profile/profile-editor';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { logout } from '../../services/user/user-reducer';
import { appRoutes } from '../../utils/constants';

import type React from 'react';

import styles from './profile.module.css';

export const ProfilePage: React.FC = () => {
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <div className={styles.root}>
        <aside className={`${styles.side_root} mr-15`}>
          <ul className={styles.side_tabs}>
            <li>
              <NavLink to={appRoutes.profile} end>
                {({ isActive }) => (
                  <p className={`${styles.link_text} pb-2 ${styles.link} ${isActive ? styles.link_active : ''}`}>
                    Профиль
                  </p>
                )}
              </NavLink>
            </li>
            <li>
              <NavLink to={appRoutes.profileOrders} end>
                {({ isActive }) => (
                  <p className={`${styles.link_text} pb-2 ${styles.link} ${isActive ? styles.link_active : ''}`}>
                    История заказов
                  </p>
                )}
              </NavLink>
            </li>
            <li>
              <button
                onClick={onLogout}
                className={`${styles.button} text text_type_main-medium text_color_inactive pb-4`}
              >
                Выход
              </button>
            </li>
          </ul>
          <p className={`${styles.info} text text_type_main-default text_color_inactive mt-20`}>
            В этом разделе вы можете изменить свои персональные данные
          </p>
        </aside>
        <ProfileEditor />
      </div>
    </div>
  );
};
