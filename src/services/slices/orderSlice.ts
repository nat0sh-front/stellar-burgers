import { orderBurgerApi } from "@api";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { TOrder } from "@utils-types";

type TOrderState = {
    order: TOrder | null;
    isOrderLoading: boolean;
    error: string | null;
}

const initialState: TOrderState = {
    order: null,
    isOrderLoading: false,
    error: null
}

export const createOrder = createAsyncThunk(
    'order/createOrder',
    async (data: string[]) => await orderBurgerApi(data)
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
    extraReducers(builder) {
        builder
            .addCase(createOrder.pending, (state) => {
                state.isOrderLoading = true;
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.isOrderLoading = false;
                state.error = action.error.message || null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.isOrderLoading = false;
                state.order = action.payload.order
            })
    }
});

export const { clearOrder } = orderSlice.actions;
export const orderReducer = orderSlice.reducer;
