import { useMemo, type JSX } from 'react';
import { useParams } from 'react-router-dom';

import { useAppSelector } from '../../hooks/use-selector';
import { getAllIngredients } from '../../services/ingredient/ingredients-selector';

import styles from './ingredient-details.module.css';

export const IngredientDetails = (): React.JSX.Element | null => {
  const { id } = useParams<{ id: string }>();
  const allIngredients = useAppSelector(getAllIngredients);

  const ingredient = useMemo(() => allIngredients.find((i) => i._id === id), [allIngredients, id]);

  const getCellContent = (title: string, value: number): JSX.Element => {
    return (
      <div className={styles.details_table_cell}>
        <span className="text text_type_main-default text_color_inactive">{title}</span>
        <span className="text text_type_digits-default text_color_inactive pt-2">{value}</span>
      </div>
    );
  };

  return !allIngredients.length || !ingredient ? (
    <p className="text text_type_main-default p-10">Ингредиент не найден или еще не загружен</p>
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
