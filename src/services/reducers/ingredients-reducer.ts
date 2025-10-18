import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import {
  IngredientType,
  type TIngredient,
  type TIngredientResponse,
} from '../../utils/ingredient-types.ts';
import { loadIngredients } from '../remote-api-service';

import type { RootState } from '../store';
import type { PayloadAction } from '@reduxjs/toolkit';

const bunCount = 2;

export type TIngredientCount = { id: string; count: number };
export type TIngredientCountWithId = TIngredientCount & { internalId: string };

type IIngredientsState = {
  ingredients: TIngredient[];

  loading: boolean;
  error: boolean;

  dragging: string;

  constructor: {
    bun?: TIngredientCount;
    middles: TIngredientCountWithId[];
    totalPrice: number;
  };
};

const initialState: IIngredientsState = {
  ingredients: [],
  loading: false,
  error: false,

  constructor: {
    bun: undefined,
    middles: [],
    totalPrice: 0,
  },
  dragging: '',
};

const calcPrice = (state: IIngredientsState): number => {
  const ingredientsToCalc: TIngredientCount[] = [...state.constructor.middles];
  if (state.constructor.bun) {
    ingredientsToCalc.push(state.constructor.bun);
  }

  return ingredientsToCalc.reduce((acc, item) => {
    const ingredient = state.ingredients.find((i) => i._id === item.id);
    if (!ingredient) {
      return acc;
    }
    return acc + ingredient.price * item.count;
  }, 0);
};

export const loadAllIngredients = createAsyncThunk(
  'ingredients/loadAllIngredients',
  loadIngredients
);

export const ingredients = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {
    // Установить ингредиент для перетаскивания
    setDragging: (state, action: PayloadAction<string>) => {
      state.dragging = action.payload;
    },
    // Поменять местами
    swapIngredients: (state, action: PayloadAction<string>) => {
      const dragIndex = [...state.constructor.middles].findIndex(
        (ing) => ing.internalId === state.dragging
      );
      const hoverIndex = state.constructor.middles.findIndex(
        (item) => item.internalId === action.payload
      );

      if (dragIndex >= 0 && hoverIndex >= 0) {
        const temp = state.constructor.middles[dragIndex];
        state.constructor.middles[dragIndex] = state.constructor.middles[hoverIndex];
        state.constructor.middles[hoverIndex] = temp;
      }
    },
    // Добавить ингредиент
    markIngredientInUse: {
      reducer: (state, action: PayloadAction<{ id: string; internalId?: string }>) => {
        const ingredient = state.ingredients.find((i) => i._id === action.payload.id);
        if (!ingredient) {
          return;
        }

        if (ingredient.type === IngredientType.BUN) {
          state.constructor.bun = { id: action.payload.id, count: bunCount };
        } else {
          const internalId = action.payload.internalId ?? '';
          state.constructor.middles.push({
            id: action.payload.id,
            count: 1,
            internalId,
          });
        }
        state.constructor.totalPrice = calcPrice(state);
      },
      prepare: (id: string) => {
        return { payload: { id, internalId: uuidv4() } };
      },
    },
    // Удалить ингредиент
    unmarkIngredientInUse: (state, action: PayloadAction<string>) => {
      state.constructor.middles = state.constructor.middles.filter(
        (item) => item.internalId !== action.payload
      );
      state.constructor.totalPrice = calcPrice(state);
    },
    // очистить используемые ингредиенты
    resetIngredientsInUse: (state) => {
      state.constructor.bun = initialState.constructor.bun;
      state.constructor.middles = initialState.constructor.middles;
      state.constructor.totalPrice = initialState.constructor.totalPrice;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadAllIngredients.pending, (state) => {
      state.loading = true;
    });
    builder.addCase<any>(
      loadAllIngredients.fulfilled,
      (state, action: TIngredientResponse) => {
        const { data } = action.payload;
        state.ingredients = data;
        state.loading = false;
        state.error = false;
      }
    );
    builder.addCase(loadAllIngredients.rejected, (state) => {
      state.error = true;
    });
  },
});

export const getAllIngredients = (state: RootState): TIngredient[] => {
  return state.ingredients.ingredients;
};

export const getBun = (state: RootState): (TIngredient & TIngredientCount) | null => {
  const bun = state.ingredients.ingredients.find(
    (i) => i._id === state.ingredients.constructor.bun?.id
  );
  if (!bun) return null;

  return { ...bun, count: 2 } as unknown as TIngredient & TIngredientCount;
};

export const getMiddles = (
  state: RootState
): (TIngredient & TIngredientCountWithId)[] => {
  return state.ingredients.constructor.middles.map((main) => {
    const foundIngredient = state.ingredients.ingredients.find(
      (ingredient) => ingredient._id === main.id
    )!;
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

const { actions, reducer } = ingredients;

export const {
  markIngredientInUse,
  unmarkIngredientInUse,
  resetIngredientsInUse,
  setDragging,
  swapIngredients,
} = actions;

export default reducer;
