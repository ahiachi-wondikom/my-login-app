import { NextResponse } from 'next/server'

// In a real app, you'd store this in a database
const users = []

export async function POST(request) {
	try {
		const body = await request.json()
		const { name, email, password } = body

		// Validation
		if (!name || !email || !password) {
			return NextResponse.json(
				{ error: 'Name, email and password are required' },
				{ status: 400 },
			)
		}

		// Check if user already exists
		const existingUser = users.find((user) => user.email === email)
		if (existingUser) {
			return NextResponse.json(
				{ error: 'User with this email already exists' },
				{ status: 409 },
			)
		}

		// Create new user
		const newUser = {
			id: String(users.length + 1),
			name: name,
			email: email,
			password: password, // In production, hash this!
			createdAt: new Date().toISOString(),
		}

		users.push(newUser)

		// Generate token
		const token = `jwt-token-${newUser.id}-${Date.now()}`

		// Don't send password back
		const { password: _, ...userWithoutPassword } = newUser

		return NextResponse.json(
			{
				user: userWithoutPassword,
				token: token,
				message: 'Account created successfully',
			},
			{ status: 201 },
		)
	} catch (error) {
		console.error('Signup API error:', error)
		return NextResponse.json(
			{ error: 'Internal server error' },
			{ status: 500 },
		)
	}
}
