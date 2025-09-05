import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import { createPortal } from 'react-dom';

import type { TIngredient } from '../../utils/types';
import type { JSX } from 'react';

import styles from './ingredient-details.module.css';

type TIngredientDetalsProps = {
  isOpen: boolean;
  ingredient: TIngredient | null;
  onClose: () => void;
};

export const IngredientDetals = ({
  isOpen,
  ingredient,
  onClose,
}: TIngredientDetalsProps): React.JSX.Element | null => {
  if (!isOpen || !ingredient) {
    return null;
  }

  const modalRoot = document.getElementById('underoot-modals');

  if (!modalRoot) {
    console.error("На странице потерялся элемент 'underoot-modals'.");
    return null;
  }

  const getCellContent = (title: string, value: number): JSX.Element => {
    return (
      <div className={styles.details_table_cell}>
        <span className="text text_type_main-default text_color_inactive">{title}</span>
        <span className="text text_type_main-default text_color_inactive">{value}</span>
      </div>
    );
  };

  return createPortal(
    <div className={styles.details_root}>
      <div className={styles.details_title}>
        <p className={`${styles.details_title_text} text text_type_main-large`}>
          Детали ингредиента
        </p>
        <CloseIcon
          type="secondary"
          className={styles.details_title_button}
          onClick={onClose}
        />
      </div>
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
    </div>,
    modalRoot
  );
};
