import { userReducer, getUserThunk, loginUserThunk, logoutUserThunk, updateUserThunk, clearError } from '../services/slices/userSlice';
import { TUser } from '@utils-types';

describe('Тест редюсер слайса Пользователя', () => {
  const initialState = {
    user: { name: '', email: '' },
    isAuthenticated: false,
    isUserLoading: false,
    error: null
  };

  const mockUser: TUser = {
    name: 'Test User',
    email: 'test@example.com'
  };

  test('Инициализация начального состояния', () => {
    const state = userReducer(undefined, { type: 'UNKNOWN_ACTION' });
    expect(state).toEqual(initialState);
  });

  // getUserThunk
  test('pending getUserThunk', () => {
    const state = userReducer(initialState, { type: getUserThunk.pending.type });
    expect(state.isUserLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled getUserThunk', () => {
    const state = userReducer(initialState, { type: getUserThunk.fulfilled.type, payload: mockUser });
    expect(state.isUserLoading).toBe(false);
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
  });

  test('rejected getUserThunk', () => {
    const state = userReducer(initialState, { type: getUserThunk.rejected.type, payload: 'Ошибка получения пользователя' });
    expect(state.isUserLoading).toBe(false);
    expect(state.error).toBe('Ошибка получения пользователя');
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
  });

  // loginUserThunk
  test('fulfilled loginUserThunk', () => {
    const state = userReducer(initialState, { type: loginUserThunk.fulfilled.type, payload: mockUser });
    expect(state.user).toEqual(mockUser);
    expect(state.isAuthenticated).toBe(true);
    expect(state.isUserLoading).toBe(false);
  });

  test('rejected loginUserThunk', () => {
    const state = userReducer(initialState, { type: loginUserThunk.rejected.type, payload: 'Ошибка входа' });
    expect(state.error).toBe('Ошибка входа');
    expect(state.isAuthenticated).toBe(false);
    expect(state.user).toEqual({ name: '', email: '' });
  });

  // logoutUserThunk 
  test('fulfilled logoutUserThunk', () => {
    const loggedInState = { ...initialState, user: mockUser, isAuthenticated: true };
    const state = userReducer(loggedInState, { type: logoutUserThunk.fulfilled.type });
    expect(state.user).toEqual({ name: '', email: '' });
    expect(state.isAuthenticated).toBe(false);
  });

  // updateUserThunk
  test('fulfilled updateUserThunk', () => {
    const updatedUser = { name: 'Updated', email: 'updated@example.com' };
    const state = userReducer(initialState, { type: updateUserThunk.fulfilled.type, payload: updatedUser });
    expect(state.user).toEqual(updatedUser);
    expect(state.isUserLoading).toBe(false);
  });

  test('rejected updateUserThunk', () => {
    const state = userReducer(initialState, { type: updateUserThunk.rejected.type, payload: 'Ошибка обновления' });
    expect(state.error).toBe('Ошибка обновления');
    expect(state.isUserLoading).toBe(false);
  });

  test('Очистка ошибки', () => {
    const stateWithError = { ...initialState, error: 'Some error' };
    const state = userReducer(stateWithError, clearError());
    expect(state.error).toBeNull();
  });
});
