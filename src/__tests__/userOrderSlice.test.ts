import { userOrderReducer, getUserOrdersThunk, clearOrder } from '../services/slices/userOrderSlice';
import { TOrder } from '@utils-types';

describe('Тест редюсер слайса Заказы пользователя', () => {
  const initialState = {
    orders: [],
    isOrderLoading: false,
    error: null
  };

  const mockOrders: TOrder[] = [
    {
      _id: '1',
      ingredients: ['1', '2'],
      status: 'done',
      name: 'Order 1',
      number: 101,
      createdAt: '2025-11-22T12:00:00Z',
      updatedAt: '2025-11-22T12:10:00Z'
    },
    {
      _id: '2',
      ingredients: ['3', '4'],
      status: 'pending',
      name: 'Order 2',
      number: 102,
      createdAt: '2025-11-22T13:00:00Z',
      updatedAt: '2025-11-22T13:10:00Z'
    }
  ];

  test('Инициализация начального состояния', () => {
    const state = userOrderReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('Pending getUserOrdersThunk', () => {
    const action = { type: getUserOrdersThunk.pending.type };
    const state = userOrderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Fulfilled getUserOrdersThunk', () => {
    const action = { type: getUserOrdersThunk.fulfilled.type, payload: mockOrders };
    const state = userOrderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.orders).toEqual(mockOrders);
    expect(state.error).toBeNull();
  });

  test('Rejected getUserOrdersThunk', () => {
    const action = { type: getUserOrdersThunk.rejected.type, error: { message: 'Failed to fetch' } };
    const state = userOrderReducer(initialState, action);
    expect(state.isOrderLoading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  test('Очистка заказов', () => {
    const stateWithOrders = { ...initialState, orders: mockOrders, isOrderLoading: true };
    const state = userOrderReducer(stateWithOrders, clearOrder());
    expect(state.orders).toHaveLength(0);
    expect(state.isOrderLoading).toBe(false);
  });
});
