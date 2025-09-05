import {
  Button,
  ConstructorElement,
  CurrencyIcon,
  DragIcon,
  LockIcon,
} from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { PopupOrderAccepted } from '../popup-order-accepted/popup-order-accepted';
import { PopupOverlay } from '../popup-overlay/popup-overlay';

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
      <div
        className={styles.burger_constructor_flow}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {edgeItem && (
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <LockIcon type="disabled" className="p-1" />
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
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}
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
          <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <LockIcon type="disabled" className="p-1" />
            <ConstructorElement
              key={`${edgeItem._id}_bottom`}
              type="top"
              isLocked={true}
              price={edgeItem.price}
              text={`${edgeItem.name} (низ)`}
              thumbnail={edgeItem.image}
            />
          </div>
        )}
      </div>
      <div className={`${styles.burger_constructor_total} p-4`}>
        <span className="text text_type_digits-medium">{calcTotalPrice()}</span>
        <CurrencyIcon className="p-1" type="primary" />
        <Button
          htmlType={'button'}
          type="primary"
          size="medium"
          style={{ marginLeft: 10 }}
          title="Оформить заказ"
          disabled={cartIngredients.length === 0}
          onClick={onOpenOrder}
        >
          Оформить заказ
        </Button>
      </div>
      <PopupOverlay isOpen={isOrderOpen} />
      <PopupOrderAccepted
        isOpen={isOrderOpen}
        onClose={onCloseOrder}
      ></PopupOrderAccepted>
    </section>
  );
};
