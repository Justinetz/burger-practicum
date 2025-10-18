import { Tab } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useMemo, useRef, useState } from 'react';

import { useModal } from '../../hooks/use-modal';
import { useAppSelector } from '../../hooks/use-selector';
import { getAllIngredients } from '../../services/reducers/ingredients-reducer';
import { type TIngredient, IngredientType } from '../../utils/ingredient-types.ts';
import { IngredientDetails } from '../ingredient-details/ingredient-details';
import { Modal } from '../modal/modal';
import { IngredientCard } from './ingredient-card/ingredient-card';

import styles from './burger-ingredients.module.css';

type TBurgerIngredientsTab = {
  key: IngredientType;
  name: string;
  index: number;
};
enum TabIndexes {
  BUN = 0,
  SAUCE = 1,
  MAIN = 2,
}

const tabs: TBurgerIngredientsTab[] = [
  {
    key: IngredientType.BUN,
    name: 'Булки',
    index: TabIndexes.BUN,
  },
  {
    key: IngredientType.SAUCE,
    name: 'Соусы',
    index: TabIndexes.SAUCE,
  },
  {
    key: IngredientType.MAIN,
    name: 'Начинки',
    index: TabIndexes.MAIN,
  },
];

const minTopFlowOffset = 0;
const flowTopOffset = 40;
const defaultFlowScrolls = [0, 0, 0];
const flowSectionClassName = 'ingredients_flow_item';

/**
 * Список ингредиентов.
 */
export const BurgerIngredients = (): React.JSX.Element => {
  const ingredients: TIngredient[] = useAppSelector(getAllIngredients);

  const dataContainerRef = useRef<HTMLDivElement>(null);
  const ingredientsFlowRef = useRef<any>(null);
  const ingredientsFlowContentRef = useRef<any>(null);

  const initialIngredientsFlowHeights = useMemo<number[]>(() => defaultFlowScrolls, []);

  const [activeTab, setActiveTab] = useState<string>(tabs[0].key);
  const [detailsItem, setDetailsItem] = useState<TIngredient | null>(null);

  const [ingredientsFlowScroll, setIngredientsFlowScroll] = useState(defaultFlowScrolls);
  const [topFlowOffset, setTopFlowOffset] = useState(0);

  const { isModalOpen, openModal, closeModal } = useModal();

  useEffect(() => {
    const flowSections = (ingredientsFlowContentRef.current ?? []) as HTMLDivElement[];
    if (flowSections.length === tabs.length && initialIngredientsFlowHeights) {
      initialIngredientsFlowHeights[TabIndexes.BUN] =
        flowSections[TabIndexes.BUN].getBoundingClientRect()?.bottom ?? 0;
      initialIngredientsFlowHeights[TabIndexes.SAUCE] =
        flowSections[TabIndexes.SAUCE].getBoundingClientRect()?.bottom ?? 0;
      initialIngredientsFlowHeights[TabIndexes.MAIN] =
        flowSections[TabIndexes.MAIN].getBoundingClientRect()?.bottom ?? 0;
    }
  }, [ingredientsFlowContentRef]);

  useEffect(() => {
    setTopFlowOffset(dataContainerRef.current?.getBoundingClientRect().y ?? 0);

    const headerElements = document.querySelectorAll(`.${flowSectionClassName}`);
    ingredientsFlowRef.current = Array.from(headerElements);

    setIngredientsFlowScroll(
      ingredientsFlowRef.current?.map(
        (elem: Element) => elem.getBoundingClientRect().y - topFlowOffset
      ) ?? defaultFlowScrolls
    );

    const contentElements = document.querySelectorAll(
      `.${styles.burger_ingredients_list}`
    );
    ingredientsFlowContentRef.current = Array.from(contentElements);

    setIngredientsFlowScroll(
      ingredientsFlowContentRef.current?.map(
        (elem: Element) => elem.getBoundingClientRect().y - topFlowOffset
      ) ?? defaultFlowScrolls
    );
  }, [topFlowOffset]);

  useEffect(() => {
    if (ingredientsFlowScroll[TabIndexes.MAIN] < minTopFlowOffset) {
      setActiveTab(tabs.find((t) => t.index === Number(TabIndexes.MAIN))!.key);
    } else if (ingredientsFlowScroll[TabIndexes.SAUCE] < minTopFlowOffset) {
      setActiveTab(tabs.find((t) => t.index === Number(TabIndexes.SAUCE))!.key);
    } else if (ingredientsFlowScroll[TabIndexes.BUN] <= minTopFlowOffset) {
      setActiveTab(tabs.find((t) => t.index === Number(TabIndexes.BUN))!.key);
    }
  }, [ingredientsFlowScroll]);

  const handleIngredientsFlowScroll = (): void => {
    setIngredientsFlowScroll(
      ingredientsFlowRef.current?.map(
        (elem: Element) => elem.getBoundingClientRect().y - topFlowOffset
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

  const onTabClick = (value: string): void => {
    setActiveTab(value);

    const tab = tabs.find((t) => String(t.key) === value)!;
    const scrollTo =
      initialIngredientsFlowHeights?.reduce((acc, item, curIndx) => {
        if (curIndx >= tab.index) {
          return acc;
        }
        return acc + item;
      }, 0) +
      flowTopOffset * tab.index;
    dataContainerRef.current?.scrollTo({ top: scrollTo });
  };

  const getIngredientsByTab = (tabKey: IngredientType): TIngredient[] => {
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
                active={activeTab === String(tab.key)}
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
        ref={dataContainerRef}
      >
        {tabs.map((tab) => {
          return (
            <div
              key={`ingredients_flow_${tab.key}`}
              className={`${flowSectionClassName} pt-10`}
            >
              <p className="text text_type_main-medium p-2">{tab.name}</p>
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
