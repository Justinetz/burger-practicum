import type { PayloadAction } from '@reduxjs/toolkit';

export enum IngredientType {
  BUN = 'bun',
  MAIN = 'main',
  SAUCE = 'sauce',
}

export type TIngredient = {
  _id: string;
  name: string;
  type: IngredientType;
  proteins: number;
  fat: number;
  carbohydrates: number;
  calories: number;
  price: number;
  image: string;
  image_large: string;
  image_mobile: string;
  __v: number;
};

export type TIngredientCount = { id: string; count: number };

export type TIngredientCountWithId = TIngredientCount & { internalId: string };

export type TIngredientResponse = PayloadAction<{
  success: boolean;
  data: TIngredient[];
}>;
