import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useDrag } from 'react-dnd';
import { Link, useLocation } from 'react-router-dom';

import { useAppSelector } from '../../../hooks/use-selector';
import { getIngredientCount } from '../../../services/ingredient/ingredients-selector';
import { appRoutes, ingredientDragDropKey } from '../../../utils/constants';

import type { TIngredient } from '../../../utils/ingredient-types';
import type { JSX } from 'react';

import styles from './ingredient-card.module.css';

export const IngredientCard = (props: { ingredient: TIngredient }): JSX.Element => {
  const { ingredient } = props;

  const location = useLocation();
  const ingredientCount = useAppSelector(getIngredientCount(ingredient._id));

  const [, ref] = useDrag({
    type: ingredientDragDropKey,
    item: { id: ingredient._id },
  });

  return (
    <Link
      className={styles.burger_ingredient_link}
      to={appRoutes.builder.ingredientDetails(ingredient._id)}
      state={{ background: location }}
    >
      <div className={`${styles.burger_ingredient_card} pl-4 pr-4`} ref={ref as any}>
        <Counter count={ingredientCount} size="default" extraClass="m-1" />
        <img alt={ingredient.name} src={ingredient.image} />
        <div className={`${styles.burger_ingredient_price} pt-1 pb-1`}>
          <p className="text text_type_digits-default">{ingredient.price}</p>
          <CurrencyIcon className="p-1" type="primary" />
        </div>
        <p className={`text text_type_main-default ${styles.burger_ingredient_name}`}>{ingredient.name}</p>
      </div>
    </Link>
  );
};
