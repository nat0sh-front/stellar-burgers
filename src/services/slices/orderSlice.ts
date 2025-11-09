import { getFeedsApi, getOrderByNumberApi, orderBurgerApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type TOrderState = {
  order: TOrder | null;
  isOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  order: null,
  isOrderLoading: false,
  error: null
};

export const createOrderThunk = createAsyncThunk(
  'order/createOrder',
  async (data: string[]) => await orderBurgerApi(data)
);

export const getOrderByNumberThunk = createAsyncThunk(
  'order/getOrderByNumber',
  async (data: number) => await getOrderByNumberApi(data)
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.isOrderLoading = false;
    }
  },
  selectors: {
    getOrder: (state) => state.order,
    getIsOrderLoading: (state) => state.isOrderLoading
  },
  extraReducers(builder) {
    builder
      .addCase(createOrderThunk.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(createOrderThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      .addCase(createOrderThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload.order;
      })

      .addCase(getOrderByNumberThunk.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(getOrderByNumberThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Ошибка получения заказа';
      })
      .addCase(getOrderByNumberThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.order = action.payload.order;
      });
  }
});

export const { clearOrder } = orderSlice.actions;
export const { getOrder, getIsOrderLoading } = orderSlice.selectors;
export const orderReducer = orderSlice.reducer;
