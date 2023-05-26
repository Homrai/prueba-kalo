import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../features/usuarioSlice";

export const store = configureStore({
    reducer:{
        user:userReducer
    }
});