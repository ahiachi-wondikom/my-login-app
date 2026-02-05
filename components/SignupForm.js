'use client'

import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { signupStart, signupSuccess, signupFailure } from '../store/authSlice'
import { signupSchema } from '../validation/authSchemas'
import './SignupForm.css'

export default function SignupForm() {
	const [formData, setFormData] = useState({
		name: '',
		email: '',
		password: '',
		confirmPassword: '',
		acceptTerms: false,
	})
	const [showPassword, setShowPassword] = useState(false)
	const [showConfirmPassword, setShowConfirmPassword] = useState(false)
	const [errors, setErrors] = useState({})
	const [touched, setTouched] = useState({})

	const dispatch = useDispatch()
	const { isLoading, error } = useSelector((state) => state.auth)

	const validateField = (fieldName, value) => {
		try {
			if (fieldName === 'confirmPassword') {
				signupSchema.parse({
					...formData,
					[fieldName]: value,
				})
			} else {
				const fieldSchema = signupSchema.pick({ [fieldName]: true })
				fieldSchema.parse({ [fieldName]: value })
			}

			setErrors((prev) => {
				const newErrors = { ...prev }
				delete newErrors[fieldName]
				return newErrors
			})
		} catch (error) {
			if (error.errors) {
				const fieldError = error.errors.find((err) => err.path[0] === fieldName)
				if (fieldError) {
					setErrors((prev) => ({
						...prev,
						[fieldName]: fieldError.message,
					}))
				}
			}
		}
	}

	const handleChange = (e) => {
		const { name, value, type, checked } = e.target
		const newValue = type === 'checkbox' ? checked : value

		setFormData((prev) => ({
			...prev,
			[name]: newValue,
		}))

		if (touched[name]) {
			validateField(name, newValue)
		}
	}

	const handleBlur = (fieldName) => {
		setTouched((prev) => ({ ...prev, [fieldName]: true }))
		validateField(fieldName, formData[fieldName])
	}

	const handleSubmit = async (e) => {
		e.preventDefault()

		setTouched({
			name: true,
			email: true,
			password: true,
			confirmPassword: true,
			acceptTerms: true,
		})

		try {
			const validatedData = signupSchema.parse(formData)
			setErrors({})

			dispatch(signupStart())

			const response = await fetch('/api/auth/signup', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					name: validatedData.name,
					email: validatedData.email,
					password: validatedData.password,
				}),
			})

			const data = await response.json()

			if (response.ok) {
				dispatch(signupSuccess(data.user))
				if (data.token) {
					localStorage.setItem('authToken', data.token)
				}
				console.log('Signup successful!', data.user)
			} else {
				dispatch(signupFailure(data.error || 'Signup failed'))
			}
		} catch (error) {
			if (error.errors) {
				const formattedErrors = {}
				error.errors.forEach((err) => {
					formattedErrors[err.path[0]] = err.message
				})
				setErrors(formattedErrors)
			}
		}
	}

	return (
		<div className='container'>
			<div className='formWrapper'>
				<h2 className='title'>Sign up</h2>

				<form onSubmit={handleSubmit} className='form' noValidate>
					<div className='formGroup'>
						<label htmlFor='name' className='label'>
							Full Name
						</label>
						<input
							id='name'
							name='name'
							type='text'
							value={formData.name}
							onChange={handleChange}
							onBlur={() => handleBlur('name')}
							className={`input ${
								touched.name && errors.name ? 'inputError' : ''
							}`}
							required
							disabled={isLoading}
						/>
						{touched.name && errors.name && (
							<span className='errorMessage'>{errors.name}</span>
						)}
					</div>

					<div className='formGroup'>
						<label htmlFor='email' className='label'>
							Email address
						</label>
						<input
							id='email'
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							onBlur={() => handleBlur('email')}
							className={`input ${
								touched.email && errors.email ? 'inputError' : ''
							}`}
							required
							disabled={isLoading}
						/>
						{touched.email && errors.email && (
							<span className='errorMessage'>{errors.email}</span>
						)}
					</div>

					<div className='formGroup'>
						<label htmlFor='password' className='label'>
							Password
						</label>
						<div className='passwordWrapper'>
							<input
								id='password'
								name='password'
								type={showPassword ? 'text' : 'password'}
								value={formData.password}
								onChange={handleChange}
								onBlur={() => handleBlur('password')}
								className={`input ${
									touched.password && errors.password ? 'inputError' : ''
								}`}
								required
								disabled={isLoading}
							/>
							<button
								type='button'
								onClick={() => setShowPassword(!showPassword)}
								className='showPasswordButton'
								disabled={isLoading}
							>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
						{touched.password && errors.password && (
							<span className='errorMessage'>{errors.password}</span>
						)}
						<div className='passwordHints'>
							<p className='hintTitle'>Password must contain:</p>
							<ul className='hintList'>
								<li className={formData.password.length >= 8 ? 'valid' : ''}>
									At least 8 characters
								</li>
								<li className={/[A-Z]/.test(formData.password) ? 'valid' : ''}>
									One uppercase letter
								</li>
								<li className={/[a-z]/.test(formData.password) ? 'valid' : ''}>
									One lowercase letter
								</li>
								<li className={/[0-9]/.test(formData.password) ? 'valid' : ''}>
									One number
								</li>
								<li
									className={
										/[^A-Za-z0-9]/.test(formData.password) ? 'valid' : ''
									}
								>
									One special character
								</li>
							</ul>
						</div>
					</div>

					<div className='formGroup'>
						<label htmlFor='confirmPassword' className='label'>
							Confirm Password
						</label>
						<div className='passwordWrapper'>
							<input
								id='confirmPassword'
								name='confirmPassword'
								type={showConfirmPassword ? 'text' : 'password'}
								value={formData.confirmPassword}
								onChange={handleChange}
								onBlur={() => handleBlur('confirmPassword')}
								className={`input ${
									touched.confirmPassword && errors.confirmPassword
										? 'inputError'
										: ''
								}`}
								required
								disabled={isLoading}
							/>
							<button
								type='button'
								onClick={() => setShowConfirmPassword(!showConfirmPassword)}
								className='showPasswordButton'
								disabled={isLoading}
							>
								{showConfirmPassword ? 'Hide' : 'Show'}
							</button>
						</div>
						{touched.confirmPassword && errors.confirmPassword && (
							<span className='errorMessage'>{errors.confirmPassword}</span>
						)}
					</div>

					<div className='formGroup'>
						<label
							className={`checkboxLabel ${
								touched.acceptTerms && errors.acceptTerms ? 'checkboxError' : ''
							}`}
						>
							<input
								type='checkbox'
								name='acceptTerms'
								checked={formData.acceptTerms}
								onChange={handleChange}
								onBlur={() => handleBlur('acceptTerms')}
								disabled={isLoading}
							/>
							<span>
								I agree to the{' '}
								<a href='/terms' className='link'>
									Terms and Conditions
								</a>
							</span>
						</label>
						{touched.acceptTerms && errors.acceptTerms && (
							<span className='errorMessage'>{errors.acceptTerms}</span>
						)}
					</div>

					{error && <div className='errorAlert'>{error}</div>}

					<button type='submit' className='submitButton' disabled={isLoading}>
						{isLoading ? 'Creating account...' : 'Sign up'}
					</button>
				</form>

				<div className='loginPrompt'>
					Already have an account?{' '}
					<a href='/login' className='loginLink'>
						Log in
					</a>
				</div>
			</div>
		</div>
	)
}
