import { feedReducer, getAllOrdersThunk } from '../services/slices/feedSlice';
import { TOrdersData } from '@utils-types';

describe('Тест редюсер слайса Лента', () => {
  const initialState = {
    feed: { orders: [], total: 0, totalToday: 0 },
    isFeedLoading: false,
    error: null
  };

  const mockFeed: TOrdersData = {
    orders: [
{
    _id: 'order123',
    ingredients: ['1', '2'],
    status: 'done',
    name: 'Test Order',
    number: 12345,
    createdAt: '2025-11-22T12:00:00Z',
    updatedAt: '2025-11-22T12:10:00Z'
  },
    ],
    total: 2,
    totalToday: 1
  };

  test('Инициализация начального состояния', () => {
    const state = feedReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('Pending getAllOrdersThunk', () => {
    const action = { type: getAllOrdersThunk.pending.type };
    const state = feedReducer(initialState, action);
    expect(state.isFeedLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Fulfilled getAllOrdersThunk', () => {
    const action = { type: getAllOrdersThunk.fulfilled.type, payload: mockFeed };
    const state = feedReducer(initialState, action);
    expect(state.isFeedLoading).toBe(false);
    expect(state.feed).toEqual(mockFeed);
    expect(state.error).toBeNull();
  });

  test('Rejected getAllOrdersThunk', () => {
    const action = { type: getAllOrdersThunk.rejected.type, error: { message: 'Failed to fetch' } };
    const state = feedReducer(initialState, action);
    expect(state.isFeedLoading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });
});
