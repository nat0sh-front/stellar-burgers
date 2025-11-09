import { getOrdersApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

type TOrderState = {
  orders: TOrder[];
  isOrderLoading: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orders: [],
  isOrderLoading: false,
  error: null
};

export const getUserOrdersThunk = createAsyncThunk(
    'order/getUserOrders',
    async () => await getOrdersApi()
);

const userOrderSlice = createSlice({
  name: 'userOrder',
  initialState,
  reducers: {
    clearOrder: (state) => {
      state.orders = [];
      state.isOrderLoading = false;
    }
  },
  selectors: {
    getOrders: (state) => state.orders,
    getIsOrderLoading: (state) => state.isOrderLoading
  },
  extraReducers(builder) {
    builder
      .addCase(getUserOrdersThunk.pending, (state) => {
        state.isOrderLoading = true;
      })
      .addCase(getUserOrdersThunk.rejected, (state, action) => {
        state.isOrderLoading = false;
        state.error = action.error.message || 'Ошибка создания заказа';
      })
      .addCase(getUserOrdersThunk.fulfilled, (state, action) => {
        state.isOrderLoading = false;
        state.orders = action.payload;
      });
  }
});

export const { clearOrder } = userOrderSlice.actions;
export const { getOrders, getIsOrderLoading } = userOrderSlice.selectors;
export const userOrderReducer = userOrderSlice.reducer;
