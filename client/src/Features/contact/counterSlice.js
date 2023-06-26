import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    data:42,
    title:"Yarc"
}

export const counterSlice = createSlice({
    name:'counter',
    initialState: initialState,
    reducers: {
        increment : (state,action) =>
        {
            state.data += action.payload
        },
        decrement : (state,action) => {
            state.data -= action.payload
        }
    }
})

export const {decrement,increment} = counterSlice.actions;