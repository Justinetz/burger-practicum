import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-constructor.module.css';

type TBurgerConstructorProps = {
  ingredients: TIngredient[];
};

type TBurgerOrder = {
  top: { types: TIngredientType[]; suffix: string };
  middle: { types: TIngredientType[]; suffix: string };
  bottom: { types: TIngredientType[]; suffix: string };
};

/**
 * Tекущий состав бургера.
 */
export const BurgerConstructor = ({
  ingredients,
}: TBurgerConstructorProps): React.JSX.Element => {
  console.log(ingredients);

  const burgerOrders: TBurgerOrder = {
    top: {
      types: ['bun'],
      suffix: 'верх',
    },
    middle: {
      types: ['sauce', 'main'],
      suffix: '',
    },
    bottom: {
      types: ['bun'],
      suffix: 'низ',
    },
  };

  return (
    <section className={styles.burger_constructor}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {burgerOrders.top.types.map((t) =>
          ingredients
            .filter((i) => i.type == t)
            .map((i) => (
              <ConstructorElement
                key={`${t}_${i._id}`}
                type="top"
                isLocked={true}
                price={i.price}
                text={i.name}
                thumbnail={i.image}
              />
            ))
        )}
        {burgerOrders.middle.types.map((t) =>
          ingredients
            .filter((i) => i.type == t)
            .map((i) => (
              <ConstructorElement
                key={`${t}_${i._id}`}
                price={i.price}
                text={i.name}
                thumbnail={i.image}
              />
            ))
        )}
        {burgerOrders.bottom.types.map((t) =>
          ingredients
            .filter((i) => i.type == t)
            .map((i) => (
              <ConstructorElement
                key={`${t}_${i._id}`}
                type="bottom"
                isLocked={true}
                price={i.price}
                text={i.name}
                thumbnail={i.image}
              />
            ))
        )}
      </div>
    </section>
  );
};
