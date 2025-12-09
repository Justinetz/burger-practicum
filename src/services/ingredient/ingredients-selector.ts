import { bunCount } from '../../utils/constants';
import { IngredientType } from '../../utils/ingredient-types';

import type { TIngredient, TIngredientCount, TIngredientCountWithId } from '../../utils/ingredient-types';
import type { RootState } from '../store';

export const getAllIngredients = (state: RootState): TIngredient[] => {
  return state.ingredients.ingredients;
};

export const getBun = (state: RootState): (TIngredient & TIngredientCount) | null => {
  const bun = state.ingredients.ingredients.find((i) => i._id === state.ingredients.constructor.bun?.id);
  if (!bun) return null;

  return { ...bun, count: 2 } as unknown as TIngredient & TIngredientCount;
};

export const getMiddles = (state: RootState): (TIngredient & TIngredientCountWithId)[] => {
  return state.ingredients.constructor.middles.map((main) => {
    const foundIngredient = state.ingredients.ingredients.find((ingredient) => ingredient._id === main.id)!;
    return {
      ...foundIngredient,
      count: main.count,
      internalId: main.internalId,
    } as unknown as TIngredient & TIngredientCountWithId;
  });
};

export const getTotalPrice = (state: RootState): number => {
  return state.ingredients.constructor.totalPrice;
};

export const getIngredientCount =
  (id: string) =>
  (state: RootState): number => {
    const ingredient = state.ingredients.ingredients.find((i) => i._id === id);
    if (!ingredient) return 0;

    if (ingredient.type === IngredientType.BUN) {
      const bun = state.ingredients.constructor.bun;
      return bun && bun.id === id ? bunCount : 0;
    }

    const main = state.ingredients.constructor.middles.filter((i) => i.id === id);
    return main ? main.length : 0;
  };

export const getIngredientById =
  (id: string) =>
  (state: RootState): TIngredient | undefined => {
    return state.ingredients.ingredients.find((i) => i._id === id);
  };

export const isIngredientsLoading = (state: RootState): boolean => {
  return state.ingredients.loading;
};
