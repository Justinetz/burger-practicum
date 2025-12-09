import { ConstructorElement, DragIcon } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { useDrag, useDrop } from 'react-dnd';

import { useAppDispatch } from '../../../hooks/use-dispatch';
import { setDragging, swapIngredients, unmarkIngredientInUse } from '../../../services/ingredient/ingredients-reducer';
import { constructorDragDropKey } from '../../../utils/constants';
import { IngredientType } from '../../../utils/ingredient-types';

import type { TIngredientCountWithId, TIngredient } from '../../../utils/ingredient-types';

import styles from './constructor-item.module.css';

export type TConstructorItemProps = {
  item: TIngredient & TIngredientCountWithId & { burgerType: 'top' | 'bottom' | 'middle' };
};

export const ConstructorItem = (props: TConstructorItemProps) => {
  const { item } = props;

  const dispatch = useAppDispatch();

  const onDeleteClick = () => dispatch(unmarkIngredientInUse(item.internalId));

  const [{ opacity, isDragging }, ref] = useDrag({
    type: constructorDragDropKey,
    item: { id: item._id },
    collect: (monitor) => ({
      opacity: monitor.isDragging() ? 0.5 : 1,
      isDragging: monitor.isDragging(),
    }),
  });

  const [{ isHover, target }, dropTarget] = useDrop({
    accept: constructorDragDropKey,
    collect: (monitor) => ({
      isHover: monitor.isOver(),
      target: monitor.getItem(),
    }),
    drop() {
      dispatch(setDragging(''));
    },
  });

  useEffect(() => {
    if (isDragging) {
      dispatch(setDragging(item.internalId));
    }
  }, [isDragging]);

  useEffect(() => {
    if (isHover && (target as any).id !== item._id) {
      dispatch(swapIngredients(item.internalId));
    }
  }, [isHover, target]);

  const burgerTypeSuffix = item.burgerType === 'top' ? '(верх)' : '(низ)';

  return item.type === IngredientType.BUN ? (
    <div className={styles.middle_item_root}>
      <ConstructorElement
        key={`${item._id}_top`}
        type={item.burgerType === 'top' ? 'top' : 'bottom'}
        isLocked={true}
        price={item.price}
        text={`${item.name} ${burgerTypeSuffix}`}
        thumbnail={item.image}
      />
    </div>
  ) : (
    <div
      key={`${item.type}_${item._id}_${item.internalId}`}
      className={`${styles.middle_item_root} ${isHover ? styles.middle_item_hover : ''}`}
      ref={ref as any}
    >
      <DragIcon type="secondary" className="p-1 pr-2" />
      <div ref={dropTarget as any} className={styles.middle_item_internal} style={{ opacity }}>
        <ConstructorElement
          price={item.price}
          text={`${item.name}`}
          thumbnail={item.image}
          handleClose={onDeleteClick}
        />
      </div>
    </div>
  );
};
