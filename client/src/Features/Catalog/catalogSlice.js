import { createEntityAdapter } from "@reduxjs/toolkit";
import agent from "../../App/api/agent";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
const productsAdapter = createEntityAdapter();

function getAxiosParams(productParams) {
    const params = new URLSearchParams();
    params.append('pageNumber', productParams.pageNumber.toString());
    params.append('pageSize', productParams.pageSize.toString());
    params.append('orderBy', productParams.orderBy.toString());
    if (productParams.searchTerm) {
        params.append('searchTerm', productParams.searchTerm);
    }
    if (productParams.brands) {
        params.append('brands', productParams.brands.toString());
    }
    if (productParams.types) {
        params.append('types', productParams.types.toString());
    }
    return params;
}
export const fetchProductsAsync = createAsyncThunk(
    'catalog/fetchProductsAsync',

    async (_,thunkAPI) => {
        const params = getAxiosParams(thunkAPI.getState().catalog.productParams);
        try {
            return await agent.catalog.list(params);
            
        }
        catch (error) {
            return thunkAPI.rejectWithValue({error:error.message});
        }
    }
);
export const fetchProductAsync = createAsyncThunk(
    'catalog/fetchProductAsync',
    async (productId,thunkAPI) => {
        try {
            return await agent.catalog.details(productId);
        }
        catch (error) {
            return thunkAPI.rejectWithValue({error:error.message});
        }
    }
);
export const fetchFilterAsync = createAsyncThunk(
    'catalog/fetchFilter',
    async (_,thunkAPI) => {
        try {
            return await agent.catalog.fetchFilter();
        }
        catch (error) {
            return thunkAPI.rejectWithValue({error:error.message});
        }
    }
);
function initParams() {
    return {
        pageNumber: 1,
        pageSize: 6,
        orderBy: 'name',
    }
}

export const catalogSlice = createSlice({
    name: 'catalog',
    initialState: productsAdapter.getInitialState({
        productsLoaded: false,
        filtersLoaded: false,
        status: 'idle',
        brands: [],
        types: [],
        productParams: initParams(),
        
    }),
    reducers: {
        setProductParams: (state, action) => {
            state.productsLoaded = false;
            state.productParams = {...state.productParams, ...action.payload};
        },
        resetProductParams: (state) => {
            state.productParams = initParams();
        }
    },
    extraReducers:(builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = 'pendingFetchProducts';
        })
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {

            productsAdapter.setAll(state, action.payload);
            state.productsLoaded = true;
            state.status = 'idle';
        })
        builder.addCase(fetchProductsAsync.rejected, (state,action) => {
            state.status = 'idle';
        })
        builder.addCase(fetchProductAsync.pending, (state) => {
            state.status = 'pendingFetchProduct';
        })
        builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
            productsAdapter.upsertOne(state, action.payload);
            state.status = 'idle';
        })
        builder.addCase(fetchProductAsync.rejected, (state,action) => {
            console.log(action);
            state.status = 'idle';
        })
        builder.addCase(fetchFilterAsync.pending, (state) => {
            state.status = 'pendingFetchFilter';
        })
        builder.addCase(fetchFilterAsync.fulfilled, (state, action) => {
            state.brands = action.payload.brands;
            state.types = action.payload.types;
            state.filtersLoaded = true;
            state.status = 'idle';
        })
        builder.addCase(fetchFilterAsync.rejected, (state,action) => {
            console.log(action);
            state.status = 'idle';
        })
    })
});

export const productSelectors = productsAdapter.getSelectors((state) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData } = catalogSlice.actions;
