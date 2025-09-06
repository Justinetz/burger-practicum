import { Counter, CurrencyIcon, Tab } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';

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

  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const [detailsItem, setDetailsItem] = useState<TIngredient | null>(null);

  const [isDetailsVisible, setIsDetailsVisible] = useState<boolean>(false);

  const onOpenDetails = (item: TIngredient): void => {
    setDetailsItem(item);
    setIsDetailsVisible(true);
  };

  const onCloseDetails = (): void => {
    setDetailsItem(null);
    setIsDetailsVisible(false);
  };

  const getIngredientListCard = (ingredient: TIngredient): JSX.Element => {
    return (
      <div
        key={`ingredient_${ingredient.type}_${ingredient._id}`}
        className={`${styles.burger_ingredient_card} pl-4 pr-4`}
        onContextMenuCapture={(e) => {
          e.preventDefault();
          addIngredient(ingredient);
        }}
        onClick={() => onOpenDetails(ingredient)}
      >
        <Counter
          count={ingredientsInUse.filter((ing) => ing._id === ingredient._id).length}
          size="default"
          extraClass="m-1"
        />
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
      <div className={`${styles.burger_ingredients_flow}`}>
        {tabs.map((tab) => {
          return (
            <div key={`ingredients_flow_${tab.key}`} className="pt-10">
              <p className="text text_type_main-medium p-2">{tab.name}</p>
              <div className={styles.burger_ingredients_list}>
                {getIngredients(tab.key).map((item) => getIngredientListCard(item))}
              </div>
            </div>
          );
        })}
      </div>
      {isDetailsVisible && (
        <Modal onClose={onCloseDetails}>
          <IngredientDetails ingredient={detailsItem} />
        </Modal>
      )}
    </section>
  );
};
