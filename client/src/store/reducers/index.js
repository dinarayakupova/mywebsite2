import {combineReducers} from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import cartSlice from "./cartSlice";


export const rootReducer = combineReducers({
 authSlice:authSlice,
 cartSlice:cartSlice
})
