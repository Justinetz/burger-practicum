import { useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { ingredients } from '@utils/ingredients';

import type { TIngredient } from '../../utils/types';

import styles from './app.module.css';

export const App = (): React.JSX.Element => {
  // На первом этапе по умолчанию конструктор заполнен всем
  const [ingredientsInUse, setIngredientsInUse] = useState<TIngredient[]>([
    ...ingredients.filter((i) => i.type !== 'bun'),
    ingredients.find((i) => i.type === 'bun')!,
  ]);

  const addIngredientToChart = (ingredient: TIngredient): void => {
    if (ingredient.type === 'bun' && ingredientsInUse.some((i) => i.type === 'bun')) {
      // Булка может быть только одного вида
      setIngredientsInUse([
        ...ingredientsInUse.filter((i) => i.type !== 'bun'),
        ingredient,
      ]);
    } else {
      setIngredientsInUse([...ingredientsInUse, ingredient]);
    }
  };

  const removeIngredientFromChart = (ingredientIndex: number): void => {
    const newIngredients = [...ingredientsInUse];
    newIngredients.splice(ingredientIndex, 1);
    setIngredientsInUse(newIngredients);
  };

  return (
    <div className={styles.app}>
      <AppHeader />
      <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
        Соберите бургер
      </h1>
      <main className={`${styles.main} pl-5 pr-5`}>
        <BurgerIngredients
          ingredients={ingredients}
          ingredientsInUse={ingredientsInUse}
          addIngredient={addIngredientToChart}
        />
        <BurgerConstructor
          ingredients={ingredientsInUse}
          removeIngredient={removeIngredientFromChart}
        />
      </main>
    </div>
  );
};

export default App;
