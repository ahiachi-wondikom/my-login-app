'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { loginStart, loginSuccess, loginFailure } from '../store/authSlice'
import styles from './LoginForm.module.css'

export default function LoginForm() {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [rememberMe, setRememberMe] = useState(false)

	const dispatch = useDispatch()
	const { user, isLoading, error } = useSelector((state) => state.auth)

	const handleSubmit = async (e) => {
		e.preventDefault()

		dispatch(loginStart())

		try {
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

			const data = await response.json()

			if (response.ok) {
				dispatch(loginSuccess(data.user))

				if (rememberMe && data.token) {
					localStorage.setItem('authToken', data.token)
				}

				console.log('Login successful!', data.user)
			} else {
				dispatch(loginFailure(data.error || 'Login failed'))
			}
		} catch (err) {
			dispatch(loginFailure('Network error. Please try again.'))
			console.error('Login error:', err)
		}
	}

	const handleOAuthLogin = (provider) => {
		window.location.href = `/api/auth/${provider}`
	}

	return (
		<div className={styles.container}>
			<div className={styles.loginBox}>
				<div className={styles.logo}></div>

				<h2 className={styles.title}>Log in</h2>

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

				<div className={styles.divider}>
					<span>OR</span>
				</div>

				<form onSubmit={handleSubmit}>
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

					{error && <div className={styles.errorMessage}>{error}</div>}

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

					<button
						type='submit'
						className={styles.submitBtn}
						disabled={isLoading}
					>
						{isLoading ? 'Logging in...' : 'Log in'}
					</button>
				</form>

				{user && (
					<div className={styles.successMessage}>
						Welcome back, {user.name || user.email}!
					</div>
				)}

				<div className={styles.signupSection}>
					<a href='/signup' className={styles.loginLink}>
						Sign up
					</a>
				</div>
			</div>
		</div>
	)
}
