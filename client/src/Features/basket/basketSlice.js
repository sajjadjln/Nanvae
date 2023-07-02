import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import agent from '../../App/api/agent';
import { getCookie } from '../../App/util/util';

const initialState = {
    basket: null,
    status: 'idle', // Add the 'status' property with an initial value
};

export const fetchBasketAsync = createAsyncThunk(
    'basket/fetchBasketAsync',
    async (_, thunkAPI) => {
        try {
            return await agent.basket.get();
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.data });
        }
    },
    {
        condition: () => {
            if (!getCookie('buyerId')) return false;
        }
    });
export const addBasketItemAsync = createAsyncThunk(
    'basket/addBasketItemAsync',
    async ({ productId, quantity = 1 }) => {
        try {
            const basket = await agent.basket.addItem(productId, quantity);
            return basket;
        } catch (error) {
            console.log(error);
            throw error; // Rethrow the error to be caught by the rejected action
        }
    }
);
export const removeBasketItemAsync = createAsyncThunk(
    'basket/removeBasketItemAsync',
    async ({ productId, quantity }) => {
        try {
            const basket = await agent.basket.removeItem(productId, quantity);
            return basket;
        } catch (error) {
            console.log(error);
            throw error; // Rethrow the error to be caught by the rejected action
        }
    }
);


export const basketSlice = createSlice({
    name: 'basket',
    initialState: initialState,
    reducers: {
        setBasket: (state, action) => {
            state.basket = action.payload;
        },
        clearBasket: (state) => {
            state.basket = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(addBasketItemAsync.pending, (state, action) => {
                state.status = 'pendingAddItem' + action.meta.arg.productId;
                console.log(action);
            });
        builder
            .addCase(removeBasketItemAsync.pending, (state, action) => {
                state.status = 'pendingRemoveItem' + action.meta.arg.productId + action.meta.arg.name;
                console.log(action);
            });
        builder
            .addCase(removeBasketItemAsync.fulfilled, (state, action) => {
                const { productId, quantity } = action.meta.arg;
                const itemIndex = state.basket.items.findIndex((item) => item.productId === productId);
                if (itemIndex === -1 || itemIndex === undefined) return;
                state.basket.items[itemIndex].quantity -= quantity;
                if (state.basket.items[itemIndex].quantity === 0) {
                    state.basket.items.splice(itemIndex, 1);
                }
                state.status = 'idle';
            });
        builder
            .addCase(removeBasketItemAsync.rejected, (state, action) => {
                state.status = 'idle';
                console.log(action);
            });
        builder
            .addMatcher(isAnyOf(addBasketItemAsync.fulfilled, fetchBasketAsync.fulfilled), (state, action) => {
                state.basket = action.payload;
                state.status = 'idle';
            });
        builder
            .addMatcher(isAnyOf(addBasketItemAsync.rejected, fetchBasketAsync.rejected), (state, action) => {
                state.status = 'failed';
                console.log(action);
            });
    }
});

export const { setBasket, clearBasket } = basketSlice.actions;