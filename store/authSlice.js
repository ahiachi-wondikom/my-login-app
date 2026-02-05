import { createSlice } from '@reduxjs/toolkit'

const initialState = {
	user: null,
	isLoading: false,
	error: null,
}

const authSlice = createSlice({
	name: 'auth',
	initialState,
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

		signupStart: (state) => {
			state.isLoading = true
			state.error = null
		},
		signupSuccess: (state, action) => {
			state.isLoading = false
			state.user = action.payload
			state.error = null
		},
		signupFailure: (state, action) => {
			state.isLoading = false
			state.error = action.payload
		},

		logout: (state) => {
			state.user = null
			state.isLoading = false
			state.error = null
			if (typeof window !== 'undefined') {
				localStorage.removeItem('authToken')
			}
		},

		clearError: (state) => {
			state.error = null
		},
	},
})

export const {
	loginStart,
	loginSuccess,
	loginFailure,
	signupStart,
	signupSuccess,
	signupFailure,
	logout,
	clearError,
} = authSlice.actions

export default authSlice.reducer
