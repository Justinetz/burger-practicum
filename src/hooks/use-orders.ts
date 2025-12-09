import { DateTime } from 'luxon';
import { useCallback, useEffect, useMemo } from 'react';

import { getAllIngredients } from '../services/ingredient/ingredients-selector';
import { setActiveOrder } from '../services/order/order-reducer';
import { getActiveOrder } from '../services/order/order-selector';
import { updateOrders } from '../services/ws-order/ws-order-reducer';
import { getWsOrders } from '../services/ws-order/ws-order.selector';
import { IngredientType } from '../utils/ingredient-types';
import { useAppDispatch } from './use-dispatch';
import { useAppSelector } from './use-selector';

import type { TOrder, TOrderIngredient } from '../utils/order-types';

export const useOrders = () => {
  const dispatch = useAppDispatch();

  const orders = useAppSelector(getWsOrders);
  const activeOrder = useAppSelector(getActiveOrder);

  const ingredients = useAppSelector(getAllIngredients);

  const hasPrice = useMemo(() => orders?.some((o) => o.price), [orders]);

  const prepareIngredients = useCallback(
    (
      order: TOrder
    ): {
      ingredients: TOrderIngredient[];
      totalPrice: number;
    } => {
      const isBun = (type: IngredientType) => type === IngredientType.BUN;

      let totalPrice = 0;
      const newIngredients = order.ingredients.reduce((resArr: TOrderIngredient[], id) => {
        const targetIngredient = ingredients.find((ingred) => ingred._id === id);
        if (!targetIngredient) {
          return [...resArr, { id: id, img: '', name: '', price: 0, qty: 0 }];
        }

        const qty = isBun(targetIngredient.type) ? 2 : 1;

        totalPrice += targetIngredient.price * qty;

        const ingredientIndexInResArr = resArr.findIndex((item) => item.id === targetIngredient._id);
        if (ingredientIndexInResArr >= 0) {
          resArr[ingredientIndexInResArr].qty += 1;
          return resArr;
        }

        return [
          ...resArr,
          {
            id: id,
            img: targetIngredient.image_mobile,
            name: targetIngredient.name,
            price: targetIngredient.price,
            qty,
          },
        ];
      }, []);

      return { ingredients: newIngredients, totalPrice };
    },
    [ingredients]
  );

  useEffect(() => {
    if (ingredients && orders) {
      const ordersToSet = [...orders]
        .sort((order1, order2) => {
          const date1 = DateTime.fromISO(order1.createdAt);
          const date2 = DateTime.fromISO(order2.createdAt);
          return date2.diff(date1, 'milliseconds').milliseconds;
        })
        .map((order) => {
          const parsedData = prepareIngredients(order);
          return { ...order, price: parsedData.totalPrice, ingredientsInfo: parsedData.ingredients };
        });
      dispatch(updateOrders(ordersToSet));
    }
  }, [hasPrice]);

  useEffect(() => {
    if (ingredients && activeOrder && !activeOrder.price) {
      const parsedData = prepareIngredients(activeOrder);
      const orderToSet = {
        ...activeOrder,
        price: parsedData.totalPrice,
        ingredientsInfo: parsedData.ingredients,
      };
      dispatch(setActiveOrder(orderToSet));
    }
  }, [activeOrder]);
};
