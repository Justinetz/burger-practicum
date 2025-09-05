import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { ModalOverlay } from '../modal-overlay/modal-overlay';
import { Modal } from '../modal/modal';
import { OrderDetails } from '../order-details/order-details';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
  removeIngredient: (ingredientIndex: number) => void;
};

type TBurgerConfig = {
  edgeType: TIngredientType;
  middle: { types: TIngredientType[]; max: number };
};

const burgerConfig: TBurgerConfig = {
  edgeType: 'bun',
  middle: {
    types: ['sauce', 'main'],
    max: 10,
  },
};

/**
 * Tекущий состав бургера.
 */
export const BurgerConstructor = ({
  ingredients,
  removeIngredient,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const cartIngredients = ingredients.map((ingr, index) => ({ ...ingr, index }));
  const edgeItem = ingredients.find((i) => i.type === burgerConfig.edgeType);

  const [isOrderOpen, setIsOrderOpen] = useState(false);

  const onOpenOrder = (): void => {
    setIsOrderOpen(true);
  };

  const onCloseOrder = (): void => {
    setIsOrderOpen(false);
  };

  const calcTotalPrice = (): number => {
    return (edgeItem ? [...cartIngredients, edgeItem] : cartIngredients).reduce(
      (accum, curIngredient) => accum + curIngredient.price,
      0
    );
  };

  return (
    <section className={styles.burger_constructor}>
      <div className={styles.burger_constructor_flow}>
        {edgeItem && (
          <div className={`${styles.burger_ingredient_root} pl-8`}>
            <ConstructorElement
              key={`${edgeItem._id}_top`}
              type="top"
              isLocked={true}
              price={edgeItem.price}
              text={`${edgeItem.name} (верх)`}
              thumbnail={edgeItem.image}
            />
          </div>
        )}

        {burgerConfig.middle.types.map((t) =>
          cartIngredients
            .filter((i) => i.type == t)
            .map((i) => (
              <div
                key={`${t}_${i._id}_${i.index}`}
                className={styles.burger_ingredient_root}
              >
                <DragIcon type="secondary" className="p-1" />
                <ConstructorElement
                  price={i.price}
                  text={`${i.name}`}
                  thumbnail={i.image}
                  handleClose={() => removeIngredient(i.index)}
                />
              </div>
            ))
        )}
        {edgeItem && (
          <div className={`${styles.burger_ingredient_root} pl-8`}>
            <ConstructorElement
              key={`${edgeItem._id}_bottom`}
              type="bottom"
              isLocked={true}
              price={edgeItem.price}
              text={`${edgeItem.name} (низ)`}
              thumbnail={edgeItem.image}
            />
          </div>
        )}
      </div>
      <div className={`${styles.burger_constructor_total} p-10`}>
        <span className="text text_type_digits-medium">{calcTotalPrice()}</span>
        <CurrencyIcon className="p-1" type="primary" />
        <Button
          htmlType={'button'}
          type="primary"
          size="medium"
          style={{ marginLeft: 40 }}
          title="Оформить заказ"
          disabled={cartIngredients.length === 0 || !edgeItem}
          onClick={onOpenOrder}
        >
          Оформить заказ
        </Button>
      </div>
      <ModalOverlay isOpen={isOrderOpen} />
      <Modal isOpen={isOrderOpen}>
        <OrderDetails onClose={onCloseOrder} />
      </Modal>
    </section>
  );
};
