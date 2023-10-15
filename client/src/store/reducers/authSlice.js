import { createSlice } from '@reduxjs/toolkit';



const initialState = {
	isLoggedIn: false,
	number: null,
	user: null,
	username: null,
	token: null,
};


export const authSlice = createSlice({
	name: 'auth',
	initialState,
	reducers: {
		loginSlice: (state, action) => {
			localStorage.setItem('data',JSON.stringify({user:action.payload.user,token:action.payload.token}))
			state.isLoggedIn = true;
			state.user = action.payload.user;
			state.token = action.payload.token;
			state.number = action.payload.user.number;
			state.username = action.payload.user.username;
		},
		logout: (state) => {
			state.isLoggedIn = false;
			state.user = null;
			state.token = null;
			state.number = null;
			state.username = null;
			localStorage.removeItem('data')
		},
	},
});

export const { loginSlice, logout } = authSlice.actions;

export default authSlice.reducer;
