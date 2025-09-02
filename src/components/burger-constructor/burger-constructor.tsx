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
      {burgerOrders.top.types.map((t) =>
        ingredients
          .filter((i) => i.type == t)
          .map((i) => <div key={`${t}_${i._id}`}>{i.name}</div>)
      )}
      {burgerOrders.middle.types.map((t) =>
        ingredients
          .filter((i) => i.type == t)
          .map((i) => <div key={`${t}_${i._id}`}>{i.name}</div>)
      )}
      {burgerOrders.bottom.types.map((t) =>
        ingredients
          .filter((i) => i.type == t)
          .map((i) => <div key={`${t}_${i._id}`}>{i.name}</div>)
      )}
    </section>
  );
};
