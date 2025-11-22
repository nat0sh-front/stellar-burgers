import { TIngredient } from '@utils-types';
import { constructorReducer, addIngredient, removeIngredient, moveIngredientUp, moveIngredientDown, clearConstructor, setBun } from '../services/slices/constructorSlice';

describe('Тест редюсер слайса Конструктора', () => {
    const initialState = {
    constructorItems: {
      bun: null,
      ingredients: []
    },
    isIngredientsLoading: false,
    error: null
  };

  const mockBun: TIngredient = {
  "_id": "bun123",
  "name": "Test Bun",
  "type": "bun",
  "proteins": 80,
  "fat": 30,
  "carbohydrates": 40,
  "calories": 420,
  "price": 100,
  "image": "https://example.com/bun.png",
  "image_large": "https://example.com/bun-large.png",
  "image_mobile": "https://example.com/bun-mobile.png"
}

const mockIngredient: TIngredient = {
  "_id": "main123",
  "name": "Test Main",
  "type": "main",
  "proteins": 200,
  "fat": 20,
  "carbohydrates": 10,
  "calories": 350,
  "price": 300,
  "image": "https://example.com/main.png",
  "image_large": "https://example.com/main-large.png",
  "image_mobile": "https://example.com/main-mobile.png"
}

  test('Инициализация начального значения', () => {
    const state = constructorReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual({ bun: null, ingredients: [] });
  });

  test('Добавление булки', () => {
    const newState = constructorReducer({ bun: null, ingredients: [] }, setBun(mockBun));
    expect(newState.bun).toMatchObject(mockBun);
  });

  test('Добавление ингредиента', () => {
    const newState = constructorReducer({ bun: null, ingredients: [] }, addIngredient(mockIngredient));
    expect(newState.ingredients).toHaveLength(1);
    expect(newState.ingredients[0]).toMatchObject(mockIngredient);
  });

  test('Удаление ингредиента по id', () => {
    const initialState = {
      bun: null,
      ingredients: [{ ...mockIngredient, id: 'test-id' }]
    };
    const newState = constructorReducer(initialState, removeIngredient('test-id'));
    expect(newState.ingredients).toHaveLength(0);
  });

  test('Перемещение ингредиента вверх', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: '1' },
        { ...mockIngredient, id: '2' },
        { ...mockIngredient, id: '3' }
      ]
    };
    const newState = constructorReducer(initialState, moveIngredientUp(2));
    expect(newState.ingredients[0].id).toBe('1');
    expect(newState.ingredients[1].id).toBe('3');
    expect(newState.ingredients[2].id).toBe('2');
  });

  test('Перемещение ингредиента вниз', () => {
    const initialState = {
      bun: null,
      ingredients: [
        { ...mockIngredient, id: '1' },
        { ...mockIngredient, id: '2' },
        { ...mockIngredient, id: '3' }
      ]
    };
    const newState = constructorReducer(initialState, moveIngredientDown(0));
    expect(newState.ingredients[0].id).toBe('2');
    expect(newState.ingredients[1].id).toBe('1');
    expect(newState.ingredients[2].id).toBe('3');
  });

  test('Очистка конструктора', () => {
    const initialState = {
      bun: { ...mockBun, id: 'bun-id' },
      ingredients: [{ ...mockIngredient, id: 'ing-id' }]
    };
    const newState = constructorReducer(initialState, clearConstructor());
    expect(newState.bun).toBeNull();
    expect(newState.ingredients).toHaveLength(0);
  });
});
