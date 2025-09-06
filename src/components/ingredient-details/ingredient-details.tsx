import type { TIngredient } from '../../utils/types';
import type { JSX } from 'react';

import styles from './ingredient-details.module.css';

type TIngredientDetailsProps = {
  ingredient: TIngredient | null;
};

export const IngredientDetails = ({
  ingredient,
}: TIngredientDetailsProps): React.JSX.Element | null => {
  const getCellContent = (title: string, value: number): JSX.Element => {
    return (
      <div className={styles.details_table_cell}>
        <span className="text text_type_main-default text_color_inactive">{title}</span>
        <span className="text text_type_digits-default text_color_inactive pt-2">
          {value}
        </span>
      </div>
    );
  };

  return ingredient == null ? (
    <></>
  ) : (
    <div className={`${styles.details_card} p-4`}>
      <img alt={ingredient.name} src={ingredient.image_large} />
      <p className="text text_type_main-medium">{ingredient.name}</p>
      <div className={styles.details_table}>
        {getCellContent('Калории, ккал', ingredient.calories)}
        {getCellContent('Белки, г', ingredient.proteins)}
        {getCellContent('Жиры, г', ingredient.fat)}
        {getCellContent('Углеводы, г', ingredient.carbohydrates)}
      </div>
    </div>
  );
};
