import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';

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

  const chartIngredients = ingredients.map((ingr, index) => ({ ...ingr, index }));
  const edgeItem = ingredients.find((i) => i.type === burgerConfig.edgeType);

  return (
    <section className={styles.burger_constructor}>
      <div
        className={styles.burger_constructor_flow}
        style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
      >
        {edgeItem && (
          <ConstructorElement
            key={`${edgeItem._id}_top`}
            type="top"
            isLocked={true}
            price={edgeItem.price}
            text={`${edgeItem.name} (верх)`}
            thumbnail={edgeItem.image}
          />
        )}

        {burgerConfig.middle.types.map((t) =>
          chartIngredients
            .filter((i) => i.type == t)
            .map((i) => (
              <ConstructorElement
                key={`${t}_${i._id}_${i.index}`}
                price={i.price}
                text={`${i.name}`}
                thumbnail={i.image}
                handleClose={() => removeIngredient(i.index)}
              />
            ))
        )}
        {edgeItem && (
          <ConstructorElement
            key={`${edgeItem._id}_bottom`}
            type="top"
            isLocked={true}
            price={edgeItem.price}
            text={`${edgeItem.name} (низ)`}
            thumbnail={edgeItem.image}
          />
        )}
      </div>
    </section>
  );
};
