import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useDrop } from 'react-dnd';

import { useAppDispatch } from '../../hooks/use-dispatch';
import { useModal } from '../../hooks/use-modal';
import { useAppSelector } from '../../hooks/use-selector';
import {
  getBun,
  getMiddles,
  getTotalPrice,
  unmarkIngredientInUse,
  markIngredientInUse,
} from '../../services/reducers/ingredients-reducer';
import {
  fetchOrder,
  getOrderDetails,
  isOrderLoading,
} from '../../services/reducers/order-reducer';
import { dragDropKey } from '../../utils/constants';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TIngredientCount } from '../../services/reducers/ingredients-reducer';
import type { TIngredientType } from '../../utils/ingredient-types.ts';

import styles from './burger-constructor.module.css';

type TBurgerConfig = {
  edgeType: TIngredientType;
  middle: { types: TIngredientType[]; max: number };
};

const burgerConfig: TBurgerConfig = {
  edgeType: 'bun',
  middle: {
    types: ['sauce', 'main'],
    max: 15,
  },
};

/**
 * Tекущий состав бургера.
 */
export const BurgerConstructor = (): React.JSX.Element => {
  const dispatch = useAppDispatch();

  const bun = useAppSelector(getBun);
  const middles = useAppSelector(getMiddles);
  const totalPrice = useAppSelector(getTotalPrice);
  const orderDetails = useAppSelector(getOrderDetails);
  const isLoading = useAppSelector(isOrderLoading);

  const { isModalOpen, openModal, closeModal } = useModal();

  const [{ isHover }, dropTarget] = useDrop({
    accept: dragDropKey,
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
    drop(item: any) {
      dispatch(markIngredientInUse((item as TIngredientCount).id));
    },
  });

  const submitOrder = (): void => {
    const allIds = [bun, ...middles].map((ingredient) => ingredient!._id);
    dispatch(fetchOrder(allIds)).then(() => openModal());
  };

  return (
    <section
      className={`${styles.burger_constructor} ${isHover ? styles.burger_constructor_hover : ''}`}
      ref={dropTarget as any}
    >
      <div className={styles.burger_constructor_flow}>
        <div className={styles.burger_constructor_fixed}>
          {bun && (
            <div className={`${styles.burger_ingredient_root} pl-8`}>
              <ConstructorElement
                key={`${bun._id}_top`}
                type="top"
                isLocked={true}
                price={bun.price}
                text={`${bun.name} (верх)`}
                thumbnail={bun.image}
              />
            </div>
          )}
        </div>
        <div className={styles.burger_constructor_dynamic}>
          {burgerConfig.middle.types.map((t) =>
            middles
              .filter((i) => i.type == t)
              .map((i) => (
                <div
                  key={`${t}_${i._id}_${i.internalId}`}
                  className={styles.burger_ingredient_root}
                >
                  <DragIcon type="secondary" className="p-1" />
                  <ConstructorElement
                    price={i.price}
                    text={`${i.name}`}
                    thumbnail={i.image}
                    handleClose={() => unmarkIngredientInUse(i.internalId)}
                  />
                </div>
              ))
          )}
        </div>
        <div className={styles.burger_constructor_fixed}>
          {bun && (
            <div className={`${styles.burger_ingredient_root} pl-8`}>
              <ConstructorElement
                key={`${bun._id}_bottom`}
                type="bottom"
                isLocked={true}
                price={bun.price}
                text={`${bun.name} (низ)`}
                thumbnail={bun.image}
              />
            </div>
          )}
        </div>
      </div>
      <div className={`${styles.burger_constructor_total}`}>
        <span className="text text_type_digits-medium">{totalPrice}</span>
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
        <Modal onClose={closeModal}>
          <OrderDetails details={orderDetails} />
        </Modal>
      )}
    </section>
  );
};
