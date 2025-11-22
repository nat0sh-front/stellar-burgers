import { rootReducer } from '../services/store';

test('rootReducer инициализируется с правильными слайсами', () => {
  const state = rootReducer(undefined, { type: '@@INIT' });

  expect(state).toHaveProperty('ingredients');
  expect(state).toHaveProperty('burgerConstructor');
  expect(state).toHaveProperty('order');
  expect(state).toHaveProperty('feed');
  expect(state).toHaveProperty('user');
  expect(state).toHaveProperty('userOrder');
});
