import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import type { TIngredient, TIngredientType } from '@utils/types';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
};

type TBurgerIngredientsTab = {
  key: TIngredientType;
  name: string;
};

/**
 * Список ингредиентов.
 */
export const BurgerIngredients = ({
  ingredients,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);

  const tabs: TBurgerIngredientsTab[] = [
    {
      key: 'bun',
      name: 'Булки',
    },
    {
      key: 'main',
      name: 'Начинки',
    },
    {
      key: 'sauce',
      name: 'Соусы',
    },
  ];

  const getIngredients = (tabKey: TIngredientType): TIngredient[] => {
    return ingredients.filter((ing) => ing.type === tabKey);
  };

  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const [activeItems, setActiveItems] = useState<TIngredient[]>(
    getIngredients(tabs[0].key)
  );

  return (
    <section className={styles.burger_ingredients}>
      <nav>
        <ul className={styles.menu}>
          {tabs.map((tab) => {
            return (
              <Tab
                key={`tab_${tab.key}`}
                value={tab.key}
                active={activeTab === tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setActiveItems(getIngredients(tab.key));
                }}
              >
                {tab.name}
              </Tab>
            );
          })}
        </ul>
      </nav>
      <>
        {activeItems.map((bun) => {
          return <p key={`ingredient_${bun.type}_${bun._id}`}>{bun.name}</p>;
        })}
      </>
    </section>
  );
};
