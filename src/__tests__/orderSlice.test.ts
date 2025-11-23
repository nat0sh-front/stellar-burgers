import { orderReducer, createOrderThunk, getOrderByNumberThunk, clearOrder, initialState } from '../services/slices/orderSlice';
import { TOrder } from '@utils-types';

describe('Тест редюсер слайса Заказ', () => {
  const mockOrder: TOrder = {
    _id: 'order123',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Test Order',
    number: 12345,
    createdAt: '2025-11-22T12:00:00Z',
    updatedAt: '2025-11-22T12:10:00Z'
  };

  test('инициализация состояния', () => {
    const state = orderReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  // createOrderThunk 
  test('Pending createOrderThunk', () => {
    const action = { type: createOrderThunk.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Fulfilled createOrderThunk', () => {
    const action = { type: createOrderThunk.fulfilled.type, payload: { order: mockOrder } };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('Rejected createOrderThunk', () => {
    const action = { type: createOrderThunk.rejected.type, error: { message: 'Failed to create' } };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe('Failed to create');
  });

  // getOrderByNumberThunk 
  test('Pending getOrderByNumberThunk', () => {
    const action = { type: getOrderByNumberThunk.pending.type };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Fulfilled getOrderByNumberThunk', () => {
    const action = { type: getOrderByNumberThunk.fulfilled.type, payload: { order: mockOrder } };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.order).toEqual(mockOrder);
    expect(state.error).toBeNull();
  });

  test('Rejected getOrderByNumberThunk', () => {
    const action = { type: getOrderByNumberThunk.rejected.type, error: { message: 'Failed to fetch' } };
    const state = orderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  test('Очистка заказа', () => {
    const stateWithOrder = { ...initialState, order: mockOrder, isOrderLoading: true };
    const state = orderReducer(stateWithOrder, clearOrder());
    expect(state.order).toBeNull();
    expect(state.isOrderLoading).toBe(false);
  });
});
