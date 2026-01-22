import { createSlice } from '@reduxjs/toolkit'

const authSlice = createSlice({
	name: 'auth',
	initialState: {
		user: null,
		isLoading: false,
		error: null,
	},
	reducers: {
		loginStart: (state) => {
			state.isLoading = true
			state.error = null
		},
		loginSuccess: (state, action) => {
			state.isLoading = false
			state.user = action.payload
			state.error = null
		},
		loginFailure: (state, action) => {
			state.isLoading = false
			state.error = action.payload
		},
		logout: (state) => {
			state.user = null
			state.error = null
		},
	},
})

export const { loginStart, loginSuccess, loginFailure, logout } =
	authSlice.actions
export default authSlice.reducer
