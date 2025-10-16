import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';

import { useModal } from '../../hooks/use-modal';
import { useAppSelector } from '../../hooks/use-selector';
import { getAllIngredients } from '../../services/reducers/ingredients-reducer';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { IngredientCard } from './ingredient-card/ingredient-card';

import type { TIngredient, TIngredientType } from '../../utils/ingredient-types.ts';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsTab = {
  key: TIngredientType;
  name: string;
};

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

/**
 * Список ингредиентов.
 */
export const BurgerIngredients = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useAppSelector(getAllIngredients);

  const tabsRef = useRef<HTMLDivElement>(null);
  const ingredientsFlowRef = useRef<any>(null);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const [detailsItem, setDetailsItem] = useState<TIngredient | null>(null);

  const [ingredientsFlowScroll, setIngredientsFlowScroll] = useState([0, 0, 0]);
  const [topOffset, setTopOffset] = useState(0);

  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    setTopOffset(Number(tabsRef.current?.getBoundingClientRect().y));
    const headerElements = document.querySelectorAll('.ingredients_flow_header');
    ingredientsFlowRef.current = Array.from(headerElements);

    setIngredientsFlowScroll(
      ingredientsFlowRef.current?.map(
        (elem: Element) => elem.getBoundingClientRect().y - topOffset
      ) ?? [0, 0, 0]
    );
  }, [topOffset]);

  useEffect(() => {
    if (ingredientsFlowScroll[2] < 0) {
      setActiveTab('main');
    } else if (ingredientsFlowScroll[1] < 0) {
      setActiveTab('sauce');
    } else if (ingredientsFlowScroll[0] <= 0) {
      setActiveTab('bun');
    }
  }, [ingredientsFlowScroll]);

  const handleIngredientsFlowScroll = (): void => {
    setIngredientsFlowScroll(
      ingredientsFlowRef.current?.map(
        (elem: Element) => elem.getBoundingClientRect().y - topOffset
      ) ?? [0, 0, 0]
    );
  };

  const onOpenDetails = (item: TIngredient): void => {
    setDetailsItem(item);
    openModal();
  };

  const onCloseDetails = (): void => {
    setDetailsItem(null);
    closeModal();
  };

  const onTabClick = (value: string): void => setActiveTab(value);

  const getIngredientsByTab = (tabKey: TIngredientType): TIngredient[] => {
    return ingredients.filter((ing) => ing.type === tabKey);
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
                onClick={onTabClick}
              >
                {tab.name}
              </Tab>
            );
          })}
        </ul>
      </nav>
      <div
        className={`${styles.burger_ingredients_flow}`}
        onScroll={handleIngredientsFlowScroll}
        ref={ingredientsFlowRef}
      >
        {tabs.map((tab) => {
          return (
            <div key={`ingredients_flow_${tab.key}`} className="pt-10">
              <p className="ingredients_flow_header text text_type_main-medium p-2">
                {tab.name}
              </p>
              <div className={styles.burger_ingredients_list}>
                {getIngredientsByTab(tab.key).map((item) => (
                  <IngredientCard
                    key={`ingredient_${item.type}_${item._id}`}
                    ingredient={item}
                    onClick={onOpenDetails}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
      {isModalOpen && (
        <Modal title="Детали ингредиента" onClose={onCloseDetails}>
          {detailsItem && <IngredientDetails ingredient={detailsItem} />}
        </Modal>
      )}
    </section>
  );
};
