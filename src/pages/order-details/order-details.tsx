import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useCallback, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { IngredientImage } from '../../components/ingredient-image/ingredient-image';
import { useAppDispatch } from '../../hooks/use-dispatch';
import { useOrders } from '../../hooks/use-orders';
import { useAppSelector } from '../../hooks/use-selector';
import { fetchOrderByNum, setActiveOrder } from '../../services/order/order-reducer';
import { getActiveOrder } from '../../services/order/order-selector';
import { getOrderByNumber } from '../../services/ws-order/ws-order.selector';
import { formatDate, toNumber } from '../../utils';
import { OrderStatus } from '../../utils/order-types';

import type React from 'react';

import styles from './order-details.module.css';

export const OrderDetailsPage: React.FC = () => {
  const dispatch = useAppDispatch();

  const { number } = useParams<{ number: string }>();
  const orderNumber = toNumber(number);

  const wsOrder = useAppSelector(getOrderByNumber(orderNumber));
  const activeOrder = useAppSelector(getActiveOrder);

  const calcStatus = useCallback((status: OrderStatus) => {
    switch (status) {
      case OrderStatus.PENDING:
        return 'Готовится';
      case OrderStatus.DONE:
        return 'Выполнен';
    }
    return 'Статус не определен';
  }, []);

  useEffect(() => {
    if (!wsOrder && !activeOrder) {
      dispatch(fetchOrderByNum(orderNumber));
    }
  }, [wsOrder, activeOrder, dispatch, orderNumber]);

  useEffect(() => {
    return () => {
      setActiveOrder(undefined);
    };
  }, []);

  useOrders();

  const data = wsOrder ?? activeOrder;

  return data ? (
    <div className={styles.root}>
      <div className={styles.card_container}>
        {/* Шапка */}
        <p className={`text text_type_digits-default mb-10`}>#{data.number} </p>
        <h2 className={`${styles.card_title} text text_type_main-medium mb-3`}>{data.name}</h2>
        <p className={`${styles.card_status} text text_type_main-default mb-15`}>{calcStatus(data.status)}</p>
        {/* Состав */}
        <h2 className={`${styles.card_title} text text_type_main-medium mb-6`}>Состав:</h2>
        <div className={`${styles.card_ingredients} mb-10`}>
          <div className={`${styles.card_ingredients_flow}`}>
            {data.ingredientsInfo ? (
              data.ingredientsInfo.map((ingredient) => {
                return (
                  <div key={ingredient.id} className={`${styles.card_ingredient}`}>
                    <IngredientImage key={`image_${ingredient.id}`} src={ingredient.img} />
                    <p className="text text_type_main-default ml-4 mr-4">{ingredient.name}</p>
                    <p
                      className={`${styles.card_price} ${styles.card_to_right} text text_type_digits-default`}
                    >{`${ingredient.qty} x ${ingredient.price}`}</p>
                    <CurrencyIcon type="primary" />
                  </div>
                );
              })
            ) : (
              <></>
            )}
          </div>
        </div>
        {/* Инфо */}
        <div className={`${styles.card_info}`}>
          <time className={`${styles.card_time} text text_type_main-default text_color_inactive`}>
            {formatDate(data.createdAt)}
          </time>
          <p className={styles.card_price_container}>
            <span className={`${styles.card_price} text text_type_digits-default`}>{data.price ?? '–'}</span>
            <CurrencyIcon type="primary" />
          </p>
        </div>
      </div>
    </div>
  ) : (
    <div className={styles.root}>
      <p className="text text_type_main-medium m-10">Данные о заказе не найдены или еще не загружены</p>
    </div>
  );
};
