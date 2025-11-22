import { ingredientsReducer, getIngredientsThunk } from '../services/slices/ingredientsSlice';
import { TIngredient } from '@utils-types';
import * as api from '@api';

describe('Тест редюсер слайса Ингредиенты', () => {
  const initialState = {
    ingredients: [],
    isIngredientsLoading: false,
    error: null
  };

  const mockIngredients: TIngredient[] = [
    {
      _id: '1',
      name: 'Bun',
      type: 'bun',
      proteins: 80,
      fat: 30,
      carbohydrates: 40,
      calories: 420,
      price: 100,
      image: 'https://example.com/bun.png',
      image_large: 'https://example.com/bun-large.png',
      image_mobile: 'https://example.com/bun-mobile.png'
    },
    {
      _id: '2',
      name: 'Main',
      type: 'main',
      proteins: 200,
      fat: 20,
      carbohydrates: 10,
      calories: 350,
      price: 300,
      image: 'https://example.com/main.png',
      image_large: 'https://example.com/main-large.png',
      image_mobile: 'https://example.com/main-mobile.png'
    }
  ];

  test('Инициализация начального состояния', () => {
    const state = ingredientsReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  test('Pending getIngredientsThunk', () => {
    const action = { type: getIngredientsThunk.pending.type };
    const state = ingredientsReducer(initialState, action);
    expect(state.isIngredientsLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Fulfilled getIngredientsThunk', () => {
    const action = { type: getIngredientsThunk.fulfilled.type, payload: mockIngredients };
    const state = ingredientsReducer(initialState, action);
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.ingredients).toEqual(mockIngredients);
    expect(state.error).toBeNull();
  });

  test('Rejected getIngredientsThunk', () => {
    const action = { type: getIngredientsThunk.rejected.type, error: { message: 'Failed' } };
    const state = ingredientsReducer(initialState, action);
    expect(state.isIngredientsLoading).toBe(false);
    expect(state.error).toBe('Failed');
  });
});
