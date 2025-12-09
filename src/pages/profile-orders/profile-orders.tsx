import { useEffect } from 'react';

import { ProfileMenu } from '../../components/profile-menu/profile-menu';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { useOrders } from '../../hooks/use-orders';
import { useAppSelector } from '../../hooks/use-selector';
import { buildAccessTokenSuffix } from '../../services/remote-api-service';
import { getAccessToken, isAuthenticated } from '../../services/user/user-selector';
import { getWsOrders } from '../../services/ws-order/ws-order.selector';
import { wsUrl } from '../../utils/constants';
import { wsStoreActions } from '../../utils/socket-types';
import { OrderList } from './order-list/order-list';

import type React from 'react';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const isUserAuthenticated = useAppSelector(isAuthenticated);
  const accessToken = useAppSelector(getAccessToken);

  const orders = useAppSelector(getWsOrders);

  useEffect(() => {
    if (isUserAuthenticated) {
      dispatch({
        type: wsStoreActions.wsCustomInit,
        payload: `${wsUrl}orders${buildAccessTokenSuffix(accessToken)}`,
      });
    }

    return () => {
      dispatch({ type: wsStoreActions.wsClose });
    };
  }, [isUserAuthenticated]);

  useOrders();

  return (
    <div>
      <div className={styles.root}>
        <ProfileMenu />
        <OrderList data={orders} />
      </div>
    </div>
  );
};
