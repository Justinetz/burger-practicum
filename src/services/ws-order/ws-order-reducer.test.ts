import { describe, expect, it } from 'vitest';

import { OrderStatus, type TOrder } from '../../utils/order-types';
import { wsStoreActions } from '../../utils/socket-types';
import reducer, { initialState, updateOrders } from './ws-order-reducer';

const buildInitialState = () => reducer(undefined, { type: 'vitest' });

const mockOrder: TOrder = {
  _id: 'order1',
  name: 'Test order',
  status: OrderStatus.PENDING,
  number: 1,
  createdAt: '2025-12-01T00:00:00.000Z',
  updatedAt: '2025-12-01T00:00:00.000Z',
  ingredients: ['ing1', 'ing2'],
};

describe('ws-order reducer', () => {
  it('returns the initial state by default', () => {
    expect(buildInitialState()).toEqual(initialState);
  });

  it('updates orders list via updateOrders action', () => {
    const state = reducer(buildInitialState(), updateOrders([mockOrder]));

    expect(state.orders).toEqual([mockOrder]);
  });

  it('handles websocket onMessage event payload', () => {
    const payload = { orders: [mockOrder], total: 10, totalToday: 2 };
    const action = {
      type: wsStoreActions.onMessage,
      payload,
    };
    const state = reducer(buildInitialState(), action);

    expect(state.orders).toEqual([mockOrder]);
    expect(state.total).toBe(10);
    expect(state.totalToday).toBe(2);
  });

  it('resets state on websocket close event', () => {
    const activeState = reducer(buildInitialState(), updateOrders([mockOrder]));
    const action = {
      type: wsStoreActions.onClose,
    };
    const state = reducer(activeState, action);

    expect(state).toEqual(buildInitialState());
  });
});
