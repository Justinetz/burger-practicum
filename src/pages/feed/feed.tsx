import { useEffect } from 'react';

import { useAppDispatch } from '../../hooks/use-dispatch';
import { useOrders } from '../../hooks/use-orders';
import { useAppSelector } from '../../hooks/use-selector';
import { getTotals, getWsOrders } from '../../services/ws-order/ws-order.selector';
import { wsStoreActions } from '../../utils/socket-types';
import { FeedList } from './feed-list/feed-list';
import { TotalPanel } from './total-panel/total-panel';

import type React from 'react';

import styles from './feed.module.css';

export const FeedPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(getWsOrders);
  const totals = useAppSelector(getTotals);

  useEffect(() => {
    dispatch({ type: wsStoreActions.wsInit });

    return () => {
      dispatch({ type: wsStoreActions.wsClose });
    };
  }, []);

  useOrders();

  return (
    <div className={styles.root}>
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>Лента заказов</h1>
      <div className={styles.container}>
        <FeedList data={orders} />
        <TotalPanel data={totals} />
      </div>
    </div>
  );
};
