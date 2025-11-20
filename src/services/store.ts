import { combineReducers, configureStore } from '@reduxjs/toolkit';
import { constructorReducer } from './slices/constructorSlice';
import { ingredientsReducer } from './slices/ingredientsSlice';
import { orderReducer } from './slices/orderSlice';
import {
  useDispatch as rawDispatch,
  useSelector as rawSelector,
  TypedUseSelectorHook
} from 'react-redux';
import { feedReducer } from './slices/feedSlice';
import { userReducer } from './slices/userSlice';
import { userOrderReducer } from './slices/userOrderSlice';

export const rootReducer = combineReducers({
  ingredients: ingredientsReducer,
  burgerConstructor: constructorReducer,
  order: orderReducer,
  feed: feedReducer,
  user: userReducer,
  userOrder: userOrderReducer
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch = () => rawDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = rawSelector;

export default store;
