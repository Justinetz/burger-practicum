import { useMemo } from 'react';

import { useAppSelector } from '../../../hooks/use-selector';
import { getWsOrders } from '../../../services/ws-order/ws-order.selector';
import { OrderStatus } from '../../../utils/order-types';

import type { IWsOrderTotal } from '../../../utils/order-types';

import styles from '../feed.module.css';

type TTotalPanel = {
  data: IWsOrderTotal;
};

const firstTen = (all: number[]) => all?.slice(0, 10);

export const TotalPanel = ({ data }: TTotalPanel) => {
  const allOrders = useAppSelector(getWsOrders);

  const pendingOrders = useMemo(
    () => allOrders?.filter((o) => o.status === OrderStatus.PENDING)?.map((o) => o.number) ?? [],
    [allOrders]
  );
  const doneOrders = useMemo(
    () => allOrders?.filter((o) => o.status === OrderStatus.DONE)?.map((o) => o.number) ?? [],
    [allOrders]
  );

  return (
    <div className={styles.totals_root}>
      <div className={styles.totals_status_panel}>
        <div>
          <p className="text text_type_main-medium mb-6">Готовы:</p>
          <div className={styles.totals_order_list}>
            {firstTen(doneOrders)?.map((num, index) => (
              <span
                key={num}
                className={`${index === doneOrders.length - 1 ? '' : styles.totals_order_number} ${styles.totals_order_done} text text_type_digits-default`}
              >
                {num}
              </span>
            ))}
          </div>
        </div>
        <div>
          <p className="text text_type_main-medium mb-6">В работе:</p>
          <ul className={styles.totals_order_list}>
            {firstTen(pendingOrders)?.map((num, index) => (
              <span
                key={num}
                className={`${index === pendingOrders.length - 1 ? '' : styles.totals_order_number} text text_type_digits-default`}
              >
                {num}
              </span>
            ))}
          </ul>
        </div>
      </div>
      <div>
        <p className="text text_type_main-medium">Выполнено за все время:</p>
        <span className={`${styles.totals_all} text text_type_digits-large`}>{data.total ?? '–'}</span>
      </div>
      <div className="mt-15">
        <p className="text text_type_main-medium">Выполнено за сегодня:</p>
        <span className={`${styles.totals_all} text text_type_digits-large`}>{data.totalToday ?? '–'}</span>
      </div>
    </div>
  );
};
