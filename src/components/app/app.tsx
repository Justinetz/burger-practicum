import { useEffect, useState } from 'react';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';

import { DataLoader } from '../../services/data-loader';

import type { TIngredient } from '../../utils/types';

import styles from './app.module.css';

const dataLoader = new DataLoader();

export const App = (): React.JSX.Element => {
  const [ingredients, setIngredients] = useState<TIngredient[]>([]);
  const [ingredientsInUse, setIngredientsInUse] = useState<TIngredient[]>([]);

  const loadIngredients = (): void => {
    const initializeWithData = (data: TIngredient[]): void => {
      setIngredients(data);

      // Пока заполняем и используемые
      setIngredientsInUse([
        ...data.filter((i: TIngredient) => i.type !== 'bun'),
        data.find((i: TIngredient) => i.type === 'bun')!,
      ]);
    };

    dataLoader.loadIngredients(initializeWithData);
  };

  useEffect(() => {
    loadIngredients();
  }, []);

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
