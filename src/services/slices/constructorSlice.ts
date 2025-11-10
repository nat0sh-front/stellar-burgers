import { createSlice, nanoid, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { RootState } from '../store';

export type TConstructorState = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

const initialState: TConstructorState = {
  bun: null,
  ingredients: []
};

const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.bun = action.payload;
      },
      prepare: (bun: TIngredient) => {
        const id = nanoid();
        return { payload: { ...bun, id } };
      }
    },
    addIngredient: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        state.ingredients.push(action.payload);
      },
      prepare: (ing: TIngredient) => {
        const id = nanoid();
        return { payload: { ...ing, id } };
      }
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },
    moveIngredientUp: (state, action: PayloadAction<number>) => {
      const currentIng = state.ingredients[action.payload];
      const nextIng = state.ingredients[action.payload - 1];

      state.ingredients.splice(action.payload - 1, 2, currentIng, nextIng);
    },
    moveIngredientDown: (state, action: PayloadAction<number>) => {
      const currentIng = state.ingredients[action.payload];
      const nextIng = state.ingredients[action.payload + 1];

      state.ingredients.splice(action.payload, 2, nextIng, currentIng);
    },
    clearConstructor: (state) => {
        state.bun = null,
        state.ingredients = []
    }
  }
});

export const getConstructorItems = (state: RootState) => state.constructor;
export const getBun = (state: RootState) => state.burgerConstructor.bun;
export const getIngredients = (state: RootState) =>
  state.burgerConstructor.ingredients;

export const {
  setBun,
  addIngredient,
  removeIngredient,
  moveIngredientUp,
  moveIngredientDown,
  clearConstructor
} = constructorSlice.actions;
export const constructorReducer = constructorSlice.reducer;
