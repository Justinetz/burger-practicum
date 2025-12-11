import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch } from '../../hooks/use-dispatch';
import { useModal } from '../../hooks/use-modal';
import { useAppSelector } from '../../hooks/use-selector';
import { markIngredientInUse, resetIngredientsInUse } from '../../services/ingredient/ingredients-reducer';
import { getBun, getMiddles, getTotalPrice } from '../../services/ingredient/ingredients-selector';
import { postOrder } from '../../services/order/order-reducer';
import { geTSendOrderDetails, isOrderLoading, isOrderFailed } from '../../services/order/order-selector';
import { isAuthenticated } from '../../services/user/user-selector.ts';
import { appRoutes, ingredientDragDropKey } from '../../utils/constants';
import { Loader } from '../loader/loader.tsx';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';
import { ConstructorItem } from './constructor-item/constructor-item.tsx';
import { DummyConstructorElement } from './dummy-item/dummy-constructor-element.tsx';

import type { TIngredient, TIngredientCountWithId } from '../../utils/ingredient-types';

import styles from './burger-constructor.module.css';

/**
 * Tекущий состав бургера.
 */
export const BurgerConstructor = (): React.JSX.Element => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isUserAuthenticated = useAppSelector(isAuthenticated);

  const bun = useAppSelector(getBun);
  const middles = useAppSelector(getMiddles);
  const totalPrice = useAppSelector(getTotalPrice);
  const orderDetails = useAppSelector(geTSendOrderDetails);
  const isLoading = useAppSelector(isOrderLoading);
  const isFailed = useAppSelector(isOrderFailed);

  const { isModalOpen, openModal, closeModal } = useModal();

  const [{ isHover }, dropTarget] = useDrop({
    accept: ingredientDragDropKey,
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
    drop(item: any) {
      dispatch(markIngredientInUse(item.id));
    },
  });

  const submitOrder = (): void => {
    if (!isUserAuthenticated) {
      navigate(appRoutes.login);
      return;
    }

    const allIds = [bun, ...middles].map((ingredient) => ingredient!._id);
    dispatch(postOrder(allIds)).then(() => {
      if (!isLoading && !isFailed) {
        dispatch(resetIngredientsInUse());
      }

      openModal();
    });
  };

  return (
    <section className={`${styles.burger_constructor} pt-10`} ref={dropTarget as any}>
      <div className={`${styles.burger_constructor_flow} ${isHover ? styles.any_container_hover : ''}`}>
        <div className={styles.burger_constructor_fixed}>
          <div className="pl-8">
            {bun ? (
              <ConstructorItem
                key={`${bun._id}_top`}
                item={{
                  ...(bun as TIngredient & TIngredientCountWithId),
                  burgerType: 'top',
                }}
              />
            ) : (
              <DummyConstructorElement key={`dummy_bun_top`} type="top" text={`Выберите булки`} />
            )}
          </div>
        </div>
        <div className={styles.burger_constructor_dynamic}>
          {middles && middles.length > 0 ? (
            middles.map((i) => (
              <ConstructorItem key={`${i.type}_${i._id}_${i.internalId}`} item={{ ...i, burgerType: 'middle' }} />
            ))
          ) : (
            <div className="pl-8">
              <DummyConstructorElement key={`dummy_bun_middle`} type="middle" text={`Выберите начинку`} />
            </div>
          )}
        </div>
        <div className={styles.burger_constructor_fixed}>
          <div className="pl-8">
            {bun ? (
              <ConstructorItem
                key={`${bun._id}_bottom`}
                item={{
                  ...(bun as TIngredient & TIngredientCountWithId),
                  burgerType: 'bottom',
                }}
              />
            ) : (
              <DummyConstructorElement key={`dummy_bun_bottom`} type="bottom" text={`Выберите булки`} />
            )}
          </div>
        </div>
      </div>
      <div className={`${styles.burger_constructor_total}`}>
        <span className="text text_type_digits-medium" data-cy="total-price">
          {totalPrice}
        </span>
        <CurrencyIcon className="p-1 pr-10" type="primary" />
        <Button
          htmlType={'button'}
          type="primary"
          size="medium"
          title="Оформить заказ"
          disabled={(middles?.length ?? 0) === 0 || !bun || isLoading}
          onClick={submitOrder}
        >
          Оформить заказ
        </Button>
      </div>
      {isModalOpen && (
        <Modal open={isModalOpen} onClose={closeModal}>
          <OrderDetails details={orderDetails} />
        </Modal>
      )}
      {isLoading && (
        <div>
          <Loader overlay={true} text="Выполняется оформление заказа..." />
        </div>
      )}
    </section>
  );
};
