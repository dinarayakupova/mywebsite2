import { createSlice } from '@reduxjs/toolkit'

const CART_KEY = 'cart'

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: localStorage.getItem(CART_KEY) ? JSON.parse(localStorage.getItem(CART_KEY)).items : [],
    totalQuantity: localStorage.getItem(CART_KEY) ? JSON.parse(localStorage.getItem(CART_KEY)).totalQuantity : 0,
    totalPrice: localStorage.getItem(CART_KEY) ? JSON.parse(localStorage.getItem(CART_KEY)).totalPrice : 0
  },
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((i) => i.id === item.id)

      if (existingItem) {
        existingItem.quantity++
      } else {
        state.items.push({
          ...item,
          quantity: 1
        })
      }
      state.totalQuantity++
      state.totalPrice += Number(item.price)
      const cartData = {
        items: [ ...state.items ],
        totalQuantity: state.totalQuantity,
        totalPrice: Number(state.totalPrice)
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cartData))

    },
    removeFromCart: (state, action) => {
      const item = action.payload
      const existingItem = state.items.find((itemState) => itemState.id === item.id)

      if (existingItem) {
        if (existingItem.quantity === 1) {
          state.items = state.items.filter((itemState) => itemState.id !== item.id)
        } else {
          existingItem.quantity--
        }

        state.totalQuantity--
        state.totalPrice -= existingItem.price
        const cartData = {
          items: state.items,
          totalQuantity: state.totalQuantity,
          totalPrice: state.totalPrice
        }
        localStorage.setItem(CART_KEY, JSON.stringify(cartData))
      }
    },
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalPrice = 0
      const cartData = {
        items: state.items,
        totalQuantity: state.totalQuantity,
        totalPrice: state.totalPrice
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cartData))

    },

    setCartFromLocalStorage: (state, action) => {
      const cartItems = action.payload
      state.items = cartItems
      state.totalQuantity = cartItems.reduce((acc, item) => acc + item.quantity, 0)
      state.totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)

      const cartData = {
        items: [ ...state.items ],
        totalQuantity: state.totalQuantity,
        totalPrice: state.totalPrice
      }
      localStorage.setItem(CART_KEY, JSON.stringify(cartData))
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  clearCart,
  setCartFromLocalStorage,
  increment
} = cartSlice.actions

export default cartSlice.reducer
