import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit';
import agent from '../../App/api/agent';
import { toast } from 'react-toastify';
import { setBasket } from '../basket/basketSlice';
const initialState = {
    user: null,
};

export const signInUser = createAsyncThunk(
    'account/signInUser',
    async (data, thunkAPI) => {
        try {
            const userDto = await agent.account.login(data);
            const {basket, ...user} = userDto;
            if (basket) {
                thunkAPI.dispatch(setBasket(basket));
            }
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    }
);

export const fetchCurrentUser = createAsyncThunk(
    'account/fetchCurrentUser',
    async (_, thunkAPI) => {
        thunkAPI.dispatch(setUser(JSON.parse(localStorage.getItem('user'))));
        try {
            const userDto = await agent.account.current();
            const {basket, ...user} = userDto;
            if (basket) {
                thunkAPI.dispatch(setBasket(basket));
            }
            localStorage.setItem('user', JSON.stringify(user));
            return user;
        } catch (error) {
            return thunkAPI.rejectWithValue({ error: error.message });
        }
    },
    {
        condition: () => {
            if (!localStorage.getItem('user')) return false;
        }
    }
);
export const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
        },
        signOut: (state) => {
            state.user = null;
            localStorage.removeItem('user');
            //! navigate('/');
        }
    },
    extraReducers: (builder => {
        builder.addCase(fetchCurrentUser.rejected, (state, action) => {
            state.user = null;
            localStorage.removeItem('user');
            toast.error('your session has expired please login again');
        });
        builder.addMatcher(isAnyOf(signInUser.fulfilled, fetchCurrentUser.fulfilled), (state, action) => {
            state.user = action.payload;
        });
        builder.addMatcher(isAnyOf(signInUser.rejected), (state, action) => {
            state.user = null;
        });
    })
});

export const { signOut, setUser } = accountSlice.actions;