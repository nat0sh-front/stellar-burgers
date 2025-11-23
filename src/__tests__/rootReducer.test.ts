import { rootReducer } from '../services/store';
import {
  constructorReducer
} from '../services/slices/constructorSlice';
import { ingredientsReducer } from '../services/slices/ingredientsSlice';
import { orderReducer } from '../services/slices/orderSlice';
import { feedReducer } from '../services/slices/feedSlice';
import { userReducer } from '../services/slices/userSlice';
import { userOrderReducer } from '../services/slices/userOrderSlice';
import store from '../services/store';

describe('rootReducer', () => {
  test('должен возвращать корректное начальное состояние', () => {
    const initAction = { type: '@@INIT' };
    const state = rootReducer(undefined, initAction);

    expect(state).toEqual({
      ingredients: ingredientsReducer(undefined, initAction),
      burgerConstructor: constructorReducer(undefined, initAction),
      order: orderReducer(undefined, initAction),
      feed: feedReducer(undefined, initAction),
      user: userReducer(undefined, initAction),
      userOrder: userOrderReducer(undefined, initAction)
    });
  });

  test('должен возвращать то же состояние при неизвестном экшене', () => {
    const prevState = store.getState();
    const state = rootReducer(prevState, { type: 'UNKNOWN_ACTION' });

    expect(state).toBe(prevState);
  });
});
