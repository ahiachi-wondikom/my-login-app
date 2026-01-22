'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import styles from './LoginForm.module.css'

export default function LoginForm() {
	// Local state for form inputs
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)

	// Redux hooks
	const dispatch = useDispatch()
	const { user, isLoading, error } = useSelector((state) => state.auth)

	// Handle form submission with real API call
	const handleSubmit = async (e) => {
		e.preventDefault()

		// 1. Start loading state
		dispatch(loginStart())

		try {
			// 2. Make API call to login endpoint
			const response = await fetch('/api/auth/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					email: email,
					password: password,
					rememberMe: rememberMe,
				}),
			})

			// 3. Parse the JSON response
			const data = await response.json()

			// 4. Check if login was successful
			if (response.ok) {
				// Success! Dispatch success action with user data
				dispatch(loginSuccess(data.user))

				// Optional: Store token in localStorage if rememberMe is checked
				if (rememberMe && data.token) {
					localStorage.setItem('authToken', data.token)
				}

				// Optional: Redirect to dashboard or home
				console.log('Login successful!', data.user)
				// window.location.href = '/dashboard' // Uncomment to redirect
			} else {
				// Failed! Dispatch failure action with error message
				dispatch(loginFailure(data.error || 'Login failed'))
			}
		} catch (err) {
			// Network error or other errors
			dispatch(loginFailure('Network error. Please try again.'))
			console.error('Login error:', err)
		}
	}

	// Handle OAuth login (Google, Facebook, Apple)
	const handleOAuthLogin = (provider) => {
		// Redirect to OAuth provider endpoint
		window.location.href = `/api/auth/${provider}`
	}

	return (
		<div className={styles.container}>
			<div className={styles.loginBox}>
				{/* Logo */}
				<div className={styles.logo}></div>

				{/* Title */}
				<h2 className={styles.title}>Log in</h2>

				{/* OAuth Buttons */}
				<button
					className={styles.oauthButton}
					onClick={() => handleOAuthLogin('google')}
					type='button'
				>
					<span className={styles.googleIcon}>G</span>
					Continue with Google
				</button>

				<button
					className={styles.oauthButton}
					onClick={() => handleOAuthLogin('facebook')}
					type='button'
				>
					<span className={styles.facebookIcon}>f</span>
					Continue with Facebook
				</button>

				<button
					className={styles.oauthButton}
					onClick={() => handleOAuthLogin('apple')}
					type='button'
				>
					<span className={styles.appleIcon}>
						<svg width='16' height='16' viewBox='0 0 16 16' fill='currentColor'>
							<path d='M11.5 1a3.5 3.5 0 0 0-3 1.64A3.5 3.5 0 0 0 5.5 1a3.5 3.5 0 0 0 0 7h1v6.5a.5.5 0 0 0 1 0V8h1a3.5 3.5 0 0 0 3-6zm0 6h-6a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 2.22 1.36.5.5 0 0 0 .89 0A2.5 2.5 0 0 1 11.5 2a2.5 2.5 0 0 1 0 5z' />
						</svg>
					</span>
					Continue with Apple
				</button>

				{/* Divider */}
				<div className={styles.divider}>
					<span>OR</span>
				</div>

				{/* Form */}
				<form onSubmit={handleSubmit}>
					{/* Email Input */}
					<div className={styles.inputGroup}>
						<label>Email address or user name</label>
						<input
							type='text'
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							className={styles.input}
							required
							disabled={isLoading}
						/>
					</div>

					{/* Password Input */}
					<div className={styles.inputGroup}>
						<label>Password</label>
						<div className={styles.passwordWrapper}>
							<input
								type={showPassword ? 'text' : 'password'}
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								className={styles.input}
								required
								disabled={isLoading}
							/>
							<button
								type='button'
								className={styles.showHideBtn}
								onClick={() => setShowPassword(!showPassword)}
								disabled={isLoading}
							>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>

					{/* Error Message */}
					{error && <div className={styles.errorMessage}>{error}</div>}

					{/* Remember Me & Forgot Password */}
					<div className={styles.options}>
						<label className={styles.checkboxLabel}>
							<input
								type='checkbox'
								checked={rememberMe}
								onChange={(e) => setRememberMe(e.target.checked)}
								disabled={isLoading}
							/>
							Remember me
						</label>
						<a href='#' className={styles.forgotPassword}>
							Forgot your password?
						</a>
					</div>

					{/* Submit Button */}
					<button
						type='submit'
						className={styles.submitBtn}
						disabled={isLoading}
					>
						{isLoading ? 'Logging in...' : 'Log in'}
					</button>
				</form>

				{/* Success Message (optional) */}
				{user && (
					<div className={styles.successMessage}>
						Welcome back, {user.name || user.email}!
					</div>
				)}

				{/* Sign Up Section */}
				<div className={styles.signupSection}>
					<p>Dont have an account?</p>
					<button className={styles.signupBtn} type='button'>
						Sign up
					</button>
				</div>
			</div>
		</div>
	)
}
