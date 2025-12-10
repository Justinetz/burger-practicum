import { describe, it, expect, vi, afterEach } from 'vitest';

import { bunCount } from '../../utils/constants';
import { IngredientType, type TIngredient } from '../../utils/ingredient-types';
import reducer, {
  initialState,
  loadAllIngredients,
  markIngredientInUse,
  unmarkIngredientInUse,
  resetIngredientsInUse,
  setDragging,
  swapIngredients,
} from './ingredients-reducer';

const buildInitialState = () => reducer(undefined, { type: 'vitest' });

const mockBun: TIngredient = {
  _id: 'any-bun-identificator',
  name: 'Test Bun',
  type: IngredientType.BUN,
  proteins: 10,
  fat: 5,
  carbohydrates: 30,
  calories: 200,
  price: 100,
  image: 'bun-image.jpg',
  image_large: 'bun-image-large.jpg',
  image_mobile: 'bun-image-mobile.jpg',
  __v: 0,
};

const mockMainIngredient: TIngredient = {
  _id: 'any-meat-identificator',
  name: 'Test Meat',
  type: IngredientType.MAIN,
  proteins: 20,
  fat: 10,
  carbohydrates: 5,
  calories: 250,
  price: 50,
  image: 'meat-image.jpg',
  image_large: 'meat-image-large.jpg',
  image_mobile: 'meat-image-mobile.jpg',
  __v: 0,
};

const mockSauceIngredient: TIngredient = {
  _id: 'any-sauce-identificator',
  name: 'Test Sauce',
  type: IngredientType.SAUCE,
  proteins: 5,
  fat: 15,
  carbohydrates: 10,
  calories: 150,
  price: 30,
  image: 'sauce-image.jpg',
  image_large: 'sauce-image-large.jpg',
  image_mobile: 'sauce-image-mobile.jpg',
  __v: 0,
};

describe('ingredients reducer', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return the initial state', () => {
    expect(buildInitialState()).toEqual(initialState);
  });

  describe('load all ingredients', () => {
    it('should set loading to true when load request is pending', () => {
      const action = { type: loadAllIngredients.pending.type };
      const state = reducer(buildInitialState(), action);

      expect(state.loading).toBe(true);
      expect(state.error).toBe(false);
    });

    it('should save ingredients in store and set flags correctly when request success', () => {
      const payload = {
        success: true,
        data: [mockBun, mockMainIngredient, mockSauceIngredient],
      };
      const action = {
        type: loadAllIngredients.fulfilled.type,
        payload,
      };
      const state = reducer(buildInitialState(), action);

      expect(state.ingredients).toEqual([mockBun, mockMainIngredient, mockSauceIngredient]);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(false);
    });

    it('should set error flag to true when request fails', () => {
      const state = reducer(buildInitialState(), loadAllIngredients.rejected(new Error('fail'), 'request1', undefined));

      expect(state.loading).toBe(false);
      expect(state.error).toBe(true);
    });
  });

  describe('dragging state', () => {
    it('should set the dragging ingredient id', () => {
      const dragId = 'drag-id-any';
      const state = reducer(buildInitialState(), setDragging(dragId));

      expect(state.dragging).toBe(dragId);
    });

    it('should update dragging id when user drag multiple times', () => {
      const state1 = reducer(buildInitialState(), setDragging('drag-1'));
      const state2 = reducer(state1, setDragging('drag-2'));

      expect(state2.dragging).toBe('drag-2');
    });
  });

  describe('swap ingredients', () => {
    it('should swap two ingredients in middles array', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient],
        dragging: 'internal1',
        constructor: {
          bun: undefined,
          middles: [
            { id: 'main1', count: 1, internalId: 'internal1' },
            { id: 'main1', count: 1, internalId: 'internal2' },
            { id: 'main1', count: 1, internalId: 'internal3' },
          ],
          totalPrice: 0,
        },
      };

      const state = reducer(initialState, swapIngredients('internal3'));

      expect(state.constructor.middles[0].internalId).toBe('internal3');
      expect(state.constructor.middles[2].internalId).toBe('internal1');
    });

    it('should not swap if source index not found', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient],
        dragging: 'any-fantastic',
        constructor: {
          bun: undefined,
          middles: [
            { id: 'main1', count: 1, internalId: 'internal1' },
            { id: 'main1', count: 1, internalId: 'internal2' },
          ],
          totalPrice: 0,
        },
      };

      const originalMiddles = [...initialState.constructor.middles];
      const state = reducer(initialState, swapIngredients('internal2'));

      expect(state.constructor.middles).toEqual(originalMiddles);
    });

    it('should not swap if target index not found', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient],
        dragging: 'internal1',
        constructor: {
          bun: undefined,
          middles: [
            { id: 'main1', count: 1, internalId: 'internal1' },
            { id: 'main1', count: 1, internalId: 'internal2' },
          ],
          totalPrice: 0,
        },
      };

      const originalMiddles = [...initialState.constructor.middles];
      const state = reducer(initialState, swapIngredients('any-fantastic'));

      expect(state.constructor.middles).toEqual(originalMiddles);
    });
  });

  describe('use ingredients', () => {
    it('should add bun to bun field and always x2', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun],
      };

      const action = markIngredientInUse(mockBun._id);
      const state = reducer(initialState, action);

      expect(state.constructor.bun).toEqual({
        id: mockBun._id,
        count: bunCount,
      });
      expect(state.constructor.totalPrice).toBe(mockBun.price * bunCount);
    });

    it('should add main ingredient to middles array', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient],
      };

      const action = markIngredientInUse(mockMainIngredient._id);
      const state = reducer(initialState, action);

      expect(state.constructor.middles).toHaveLength(1);
      expect(state.constructor.middles[0].id).toBe(mockMainIngredient._id);
      expect(state.constructor.middles[0].count).toBe(1);
      expect(state.constructor.middles[0].internalId).toBeDefined();
      expect(state.constructor.totalPrice).toBe(mockMainIngredient.price);
    });

    it('should add sauce ingredient to middles array', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockSauceIngredient],
      };

      const action = markIngredientInUse(mockSauceIngredient._id);
      const state = reducer(initialState, action);

      expect(state.constructor.middles).toHaveLength(1);
      expect(state.constructor.middles[0].id).toBe(mockSauceIngredient._id);
      expect(state.constructor.middles[0].count).toBe(1);
      expect(state.constructor.totalPrice).toBe(mockSauceIngredient.price);
    });

    it('should replace existing bun when adding another', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun, { ...mockBun, _id: 'bun2', price: 150 }],
        constructor: {
          bun: { id: mockBun._id, count: bunCount },
          middles: [],
          totalPrice: mockBun.price * bunCount,
        },
      };

      const action = markIngredientInUse('bun2');
      const state = reducer(initialState, action);

      expect(state.constructor.bun?.id).toBe('bun2');
      expect(state.constructor.totalPrice).toBe(150 * bunCount);
    });

    it('should calculate total price correctly', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun, mockMainIngredient, mockSauceIngredient],
        constructor: {
          bun: { id: mockBun._id, count: bunCount },
          middles: [{ id: mockMainIngredient._id, count: 1, internalId: 'internal1' }],
          totalPrice: 0,
        },
      };

      const action = markIngredientInUse(mockSauceIngredient._id);
      const state = reducer(initialState, action);

      const expectedPrice = mockBun.price * bunCount + mockMainIngredient.price + mockSauceIngredient.price;
      expect(state.constructor.totalPrice).toBe(expectedPrice);
    });

    it('should not add ingredient if it is not found in ingredients', () => {
      const initialState = buildInitialState();
      const action = markIngredientInUse('any-fantastic-id');
      const state = reducer(initialState, action);

      expect(state.constructor.bun).toBeUndefined();
      expect(state.constructor.middles).toHaveLength(0);
      expect(state.constructor.totalPrice).toBe(0);
    });
  });

  describe('unuse ingredients', () => {
    it('should remove ingredient from middles array by internalId', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient, mockSauceIngredient],
        constructor: {
          bun: undefined,
          middles: [
            { id: mockMainIngredient._id, count: 1, internalId: 'internal1' },
            { id: mockSauceIngredient._id, count: 1, internalId: 'internal2' },
          ],
          totalPrice: mockMainIngredient.price + mockSauceIngredient.price,
        },
      };

      const state = reducer(initialState, unmarkIngredientInUse('internal1'));

      expect(state.constructor.middles).toHaveLength(1);
      expect(state.constructor.middles[0].internalId).toBe('internal2');
      expect(state.constructor.totalPrice).toBe(mockSauceIngredient.price);
    });

    it('should recalc total price after removing ingredient', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient],
        constructor: {
          bun: undefined,
          middles: [{ id: mockMainIngredient._id, count: 1, internalId: 'internal1' }],
          totalPrice: mockMainIngredient.price,
        },
      };

      const state = reducer(initialState, unmarkIngredientInUse('internal1'));

      expect(state.constructor.middles).toHaveLength(0);
      expect(state.constructor.totalPrice).toBe(0);
    });

    it('should skip removing if internalId not found', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient],
        constructor: {
          bun: undefined,
          middles: [{ id: mockMainIngredient._id, count: 1, internalId: 'internal1' }],
          totalPrice: mockMainIngredient.price,
        },
      };

      const state = reducer(initialState, unmarkIngredientInUse('any-fantastic'));

      expect(state.constructor.middles).toHaveLength(1);
      expect(state.constructor.totalPrice).toBe(mockMainIngredient.price);
    });

    it('should update total price correctly after removin from all collections', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun, mockMainIngredient, mockSauceIngredient],
        constructor: {
          bun: { id: mockBun._id, count: bunCount },
          middles: [
            { id: mockMainIngredient._id, count: 1, internalId: 'internal1' },
            { id: mockSauceIngredient._id, count: 1, internalId: 'internal2' },
          ],
          totalPrice: mockBun.price * bunCount + mockMainIngredient.price + mockSauceIngredient.price,
        },
      };

      const state = reducer(initialState, unmarkIngredientInUse('internal1'));

      const expectedPrice = mockBun.price * bunCount + mockSauceIngredient.price;
      expect(state.constructor.totalPrice).toBe(expectedPrice);
    });
  });

  describe('reset ingradients usages', () => {
    it('should reset constructor to initial state', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun, mockMainIngredient],
        constructor: {
          bun: { id: mockBun._id, count: bunCount },
          middles: [{ id: mockMainIngredient._id, count: 1, internalId: 'internal1' }],
          totalPrice: mockBun.price * bunCount + mockMainIngredient.price,
        },
      };

      const state = reducer(initialState, resetIngredientsInUse());

      expect(state.constructor.bun).toBeUndefined();
      expect(state.constructor.middles).toEqual([]);
      expect(state.constructor.totalPrice).toBe(0);
    });
  });

  describe('calculate price', () => {
    it('should calculate price correctly if only bun', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun],
        constructor: {
          bun: { id: mockBun._id, count: bunCount },
          middles: [],
          totalPrice: 0,
        },
      };

      const action = markIngredientInUse(mockBun._id);
      const state = reducer(initialState, action);

      expect(state.constructor.totalPrice).toBe(mockBun.price * bunCount);
    });

    it('should calculate price correctly if only middles', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockMainIngredient, mockSauceIngredient],
        constructor: {
          bun: undefined,
          middles: [],
          totalPrice: 0,
        },
      };

      const action1 = markIngredientInUse(mockMainIngredient._id);
      const state1 = reducer(initialState, action1);
      const action2 = markIngredientInUse(mockSauceIngredient._id);
      const state2 = reducer(state1, action2);

      expect(state2.constructor.totalPrice).toBe(mockMainIngredient.price + mockSauceIngredient.price);
    });

    it('should calculate price correctly', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [mockBun, mockMainIngredient, mockSauceIngredient],
        constructor: {
          bun: { id: mockBun._id, count: bunCount },
          middles: [
            { id: mockMainIngredient._id, count: 1, internalId: 'internal1' },
            { id: mockSauceIngredient._id, count: 1, internalId: 'internal2' },
          ],
          totalPrice: 0,
        },
      };

      // Trigger price recalculation by adding another ingredient
      const action = markIngredientInUse(mockMainIngredient._id);
      const state = reducer(initialState, action);

      const expectedPrice = mockBun.price * bunCount + mockMainIngredient.price * 2 + mockSauceIngredient.price;
      expect(state.constructor.totalPrice).toBe(expectedPrice);
    });

    it('should return price 0 if ingredient not found', () => {
      const initialState = {
        ...buildInitialState(),
        ingredients: [],
        constructor: {
          bun: { id: 'any-fantastic', count: bunCount },
          middles: [{ id: 'any-fantastic-2', count: 1, internalId: 'internal1' }],
          totalPrice: 0,
        },
      };

      // Trigger price recalculation
      const action = markIngredientInUse('some-id');
      const state = reducer(initialState, action);

      expect(state.constructor.totalPrice).toBe(0);
    });
  });
});
