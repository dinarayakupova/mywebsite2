import { configureStore } from '@reduxjs/toolkit'
import { rootReducer } from './reducers'
import { authApi } from '../api/authApi'
import thunk from 'redux-thunk'
import { productsApi } from '../api/productsApi'
import { cartApi } from '../api/cartApi'


//above: setting up the Redux store for application, sing Redux Toolkit

//creating the store
export const store = configureStore({
  reducer: {
    auth: rootReducer,
    [authApi.reducerPath]: authApi.reducer,
    [productsApi.reducerPath]: productsApi.reducer,
    [cartApi.reducerPath]: cartApi.reducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk, authApi.middleware, productsApi.middleware, cartApi.middleware)

})

