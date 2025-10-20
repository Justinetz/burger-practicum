import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';

import { useAppSelector } from '../../../hooks/use-selector';
import { getIngredientCount } from '../../../services/reducers/ingredients-reducer';
import { dragDropKey } from '../../../utils/constants';

import type { TIngredient } from '../../../utils/ingredient-types';
import type { JSX } from 'react';

import styles from './ingredient-card.module.css';

export const IngredientCard = (props: {
  ingredient: TIngredient;
  onClick: (item: TIngredient) => void;
}): JSX.Element => {
  const { ingredient, onClick } = props;

  const ingredientCount = useAppSelector(getIngredientCount(ingredient._id));

  const [, ref] = useDrag({
    type: dragDropKey,
    item: { id: ingredient._id },
  });

  return (
    <div
      className={`${styles.burger_ingredient_card} pl-4 pr-4`}
      onClick={() => onClick(ingredient)}
      ref={ref as any}
    >
      <Counter count={ingredientCount} size="default" extraClass="m-1" />
      <img alt={ingredient.name} src={ingredient.image} />
      <div className={`${styles.burger_ingredient_price} pt-1 pb-1`}>
        <p className="text text_type_digits-default">{ingredient.price}</p>
        <CurrencyIcon className="p-1" type="primary" />
      </div>
      <p className={`text text_type_main-default ${styles.burger_ingredient_name}`}>
        {ingredient.name}
      </p>
    </div>
  );
};
