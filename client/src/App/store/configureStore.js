import { basketSlice } from "../../Features/basket/basketSlice";
import { counterSlice } from "../../Features/contact/counterSlice";
import { configureStore } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { catalogSlice } from "../../Features/Catalog/catalogSlice";
import { accountSlice } from "../../Features/account/accountSlice";

export const store = configureStore({
    reducer: {
        counter: counterSlice.reducer,
        basket: basketSlice.reducer,
        catalog: catalogSlice.reducer,
        account: accountSlice.reducer
    }
});

export const RootState = store.getState();
export const AppDispatch = store.dispatch;
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
