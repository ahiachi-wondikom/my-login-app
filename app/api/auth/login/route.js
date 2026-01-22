import { NextResponse } from 'next/server'

export async function POST(request) {
	try {
		const body = await request.json()
		const { email, password, rememberMe } = body

		if (!email || !password) {
			return NextResponse.json(
				{ error: 'Email and password are required' },
				{ status: 400 },
			)
		}

		if (email === 'test@example.com' && password === 'password123') {
			const user = {
				id: '1',
				email: email,
				name: 'John Doe',
			}

			const token = 'dummy-jwt-token-12345'

			return NextResponse.json(
				{
					user: user,
					token: token,
					message: 'Login successful',
				},
				{ status: 200 },
			)
		} else {
			return NextResponse.json(
				{ error: 'Invalid email or password' },
				{ status: 401 },
			)
		}
	} catch (error) {
		console.error('Login API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
