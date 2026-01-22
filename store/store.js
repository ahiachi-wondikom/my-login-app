import { configureStore } from '@reduxjs/toolkit'
import authReducer from './authSlice' // ← ADD THIS LINE

export const store = configureStore({
	reducer: {
		auth: authReducer,
	},
})
