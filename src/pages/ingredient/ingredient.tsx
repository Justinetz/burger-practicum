import { IngredientDetails } from '../../components/ingredient-details/ingredient-details';

import styles from './ingredient.module.css';

export const IngredientPage = () => {
  return (
    <div className={styles.root}>
      <div className={`${styles.ingredients_container}`}>
        <h1 className={`text text_type_main-large mt-10 mb-10 ${styles.header}`}>Детали ингредиента</h1>
        <IngredientDetails />
      </div>
    </div>
  );
};
