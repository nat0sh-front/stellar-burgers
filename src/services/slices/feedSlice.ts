import { getFeedsApi, getOrdersApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

export type TFeedState = {
  feed: TOrdersData;
  isFeedLoading: boolean;
  error: string | null;
};

const initialState: TFeedState = {
  feed: { orders: [], total: 0, totalToday: 0 },
  isFeedLoading: false,
  error: null
};

export const getAllOrdersThunk = createAsyncThunk(
  'order/getAllOrders',
  async () => await getFeedsApi()
);

const feedSlice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  selectors: {
    getFeed: (state) => state.feed,
    getOrders: (state) => state.feed.orders
  },
  extraReducers(builder) {
    builder
      .addCase(getAllOrdersThunk.pending, (state) => {
        state.isFeedLoading = true;
      })
      .addCase(getAllOrdersThunk.rejected, (state, action) => {
        state.isFeedLoading = false;
        state.error = action.error.message || 'Ошибка загрузки ленты';
      })
      .addCase(getAllOrdersThunk.fulfilled, (state, action) => {
        state.isFeedLoading = false;
        state.feed = action.payload;
      });
  }
});

export const { getFeed, getOrders } = feedSlice.selectors;
export const feedReducer = feedSlice.reducer;
