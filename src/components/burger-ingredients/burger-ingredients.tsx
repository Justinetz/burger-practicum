import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetals } from '../ingredient-details/ingredient-details';

import type { TIngredient, TIngredientType } from '@utils/types';
import type { JSX } from 'react';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsProps = {
  ingredients: TIngredient[];
  ingredientsInUse: TIngredient[];
  addIngredient: (ingredient: TIngredient) => void;
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
  ingredientsInUse,
  addIngredient,
}: TBurgerIngredientsProps): React.JSX.Element => {
  console.log(ingredients);

  const tabs: TBurgerIngredientsTab[] = [
    {
      key: 'bun',
      name: 'Булки',
    },
    {
      key: 'sauce',
      name: 'Соусы',
    },
    {
      key: 'main',
      name: 'Начинки',
    },
  ];

  const getIngredients = (tabKey: TIngredientType): TIngredient[] => {
    return ingredients.filter((ing) => ing.type === tabKey);
  };

  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const [detailsItem, setDetailsItem] = useState<TIngredient | null>(null);

  const onOpenDetails = (item: TIngredient): void => {
    setDetailsItem(item);
    setIsDetailsOpen(true);
  };

  const onCloseDetails = (): void => {
    setDetailsItem(null);
    setIsDetailsOpen(false);
  };

  const getIngredientListCard = (
    ingredient: TIngredient,
    index: number
  ): JSX.Element => {
    return (
      <div
        key={`ingredient_${ingredient.type}_${ingredient._id}`}
        className={styles.burger_ingredient_card}
        style={{ gridRow: Math.floor(index / 2) }}
        onClick={() => addIngredient(ingredient)}
        onContextMenuCapture={(e) => {
          e.preventDefault();
          onOpenDetails(ingredient);
        }}
      >
        <Counter
          count={ingredientsInUse.filter((ing) => ing._id === ingredient._id).length}
          size="default"
          extraClass="m-1"
        />
        <img alt={ingredient.name} src={ingredient.image} />
        <div className={styles.burger_ingredient_price}>
          <p className="text text_type_digits-default">{ingredient.price}</p>
          <CurrencyIcon className="p-1" type="primary" />
        </div>
        <p className={`text text_type_main-default ${styles.burger_ingredient_name}`}>
          {ingredient.name}
        </p>
      </div>
    );
  };

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
                }}
              >
                {tab.name}
              </Tab>
            );
          })}
        </ul>
      </nav>
      <div className={styles.burger_ingredients_flow}>
        {tabs.map((tab) => {
          return (
            <div key={`ingredients_flow_${tab.key}`}>
              <p className="text text_type_main-medium p-2">{tab.name}</p>
              <div className={styles.burger_ingredients_list}>
                {getIngredients(tab.key).map((item, index) =>
                  getIngredientListCard(item, index)
                )}
              </div>
            </div>
          );
        })}
      </div>
      <IngredientDetals
        isOpen={isDetailsOpen}
        ingredient={detailsItem}
        onClose={onCloseDetails}
      ></IngredientDetals>
    </section>
  );
};
