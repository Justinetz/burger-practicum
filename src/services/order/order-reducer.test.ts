import { describe, it, expect, vi, afterEach } from 'vitest';

import { OrderStatus, type TOrder } from '../../utils/order-types';
import reducer, { initialState, fetchOrderByNum, postOrder, setActiveOrder } from './order-reducer';

const buildInitialState = () => reducer(undefined, { type: 'vitest' });

const mockOrder: TOrder = {
  _id: 'order1',
  status: OrderStatus.PENDING,
  name: 'Test order',
  createdAt: '2025-12-01T00:00:00.000Z',
  updatedAt: '2025-12-01T00:00:00.000Z',
  number: 123,
  ingredients: ['ing-1', 'ing-2'],
};

afterEach(() => {
  vi.restoreAllMocks();
});

describe('order reducer', () => {
  it('should return the initial state as default', () => {
    expect(buildInitialState()).toEqual(initialState);
  });

  it('should set the active order directly', () => {
    const state = reducer(buildInitialState(), setActiveOrder(mockOrder));

    expect(state.activeOrder).toEqual(mockOrder);
  });

  it('should marks current order as loading', () => {
    const action = { type: postOrder.pending.type };
    const state = reducer(buildInitialState(), action);

    expect(state.detailsLoading).toBe(true);
  });

  it('should save current order in state and clears flags', () => {
    const payload = { name: 'Burger', order: { number: 42 }, success: true };
    const action = {
      type: postOrder.fulfilled.type,
      payload,
    };

    const state = reducer(buildInitialState(), action);

    expect(state.details).toEqual(payload);
    expect(state.detailsLoading).toBe(false);
    expect(state.detailsError).toBe(false);
  });

  it('should sets error flag', () => {
    const action = { type: postOrder.rejected.type };
    const state = reducer(buildInitialState(), action);

    expect(state.detailsLoading).toBe(false);
    expect(state.detailsError).toBe(true);
  });

  it('should set the active order after loading it by number', () => {
    const payload = { orders: [mockOrder], total: 1, totalToday: 1, success: true };
    const action = {
      type: fetchOrderByNum.fulfilled.type,
      payload,
    };
    const state = reducer(buildInitialState(), action);

    expect(state.activeOrder).toEqual(mockOrder);
  });
});
