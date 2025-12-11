import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

import { bunCount } from '../../utils/constants';
import { IngredientType } from '../../utils/ingredient-types';
import { loadIngredients } from '../remote-api-service';

import type {
  TIngredientCount,
  TIngredientCountWithId,
  TIngredient,
  TIngredientResponse,
} from '../../utils/ingredient-types';
import type { PayloadAction } from '@reduxjs/toolkit';

type TIngredientsState = {
  ingredients: TIngredient[];

  loading: boolean;
  error: boolean;

  dragging: string;

  selectedId: string;

  constructor: {
    bun?: TIngredientCount;
    middles: TIngredientCountWithId[];
    totalPrice: number;
  };
};

export const initialState: TIngredientsState = {
  ingredients: [],
  loading: false,
  error: false,

  constructor: {
    bun: undefined,
    middles: [],
    totalPrice: 0,
  },
  dragging: '',
  selectedId: '',
};

const calcPrice = (state: TIngredientsState): number => {
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

export const loadAllIngredients = createAsyncThunk('ingredients/loadAllIngredients', loadIngredients);

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
      const dragIndex = [...state.constructor.middles].findIndex((ing) => ing.internalId === state.dragging);
      const hoverIndex = state.constructor.middles.findIndex((item) => item.internalId === action.payload);

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
      state.constructor.middles = state.constructor.middles.filter((item) => item.internalId !== action.payload);
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
    builder.addCase<any>(loadAllIngredients.fulfilled, (state, action: TIngredientResponse) => {
      const { data } = action.payload;
      state.ingredients = data;
      state.loading = false;
      state.error = false;
    });
    builder.addCase(loadAllIngredients.rejected, (state) => {
      state.error = true;
    });
  },
});

const { actions, reducer } = ingredients;

export const { markIngredientInUse, unmarkIngredientInUse, resetIngredientsInUse, setDragging, swapIngredients } =
  actions;

export default reducer;
