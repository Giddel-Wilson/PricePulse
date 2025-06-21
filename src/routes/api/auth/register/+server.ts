import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';
import { hashPassword, createAuthUser, generateToken } from '$lib/server/auth';
import { validateEmail, validatePassword } from '$lib/utils';
import { UserRole } from '@prisma/client';

export const POST = async ({ request, cookies }: RequestEvent) => {
	try {
		const { name, email, password, confirmPassword } = await request.json();

		// Validation
		if (!name || !email || !password || !confirmPassword) {
			return json(
				{ success: false, error: 'All fields are required' },
				{ status: 400 }
			);
		}

		if (!validateEmail(email)) {
			return json(
				{ success: false, error: 'Invalid email format' },
				{ status: 400 }
			);
		}

		if (password !== confirmPassword) {
			return json(
				{ success: false, error: 'Passwords do not match' },
				{ status: 400 }
			);
		}

		const passwordValidation = validatePassword(password);
		if (!passwordValidation.isValid) {
			return json(
				{ success: false, error: passwordValidation.errors.join(', ') },
				{ status: 400 }
			);
		}

		// Check if user already exists
		const existingUser = await prisma.user.findUnique({
			where: { email }
		});

		if (existingUser) {
			return json(
				{ success: false, error: 'User with this email already exists' },
				{ status: 409 }
			);
		}

		// Create user
		const hashedPassword = await hashPassword(password);
		const user = await prisma.user.create({
			data: {
				name,
				email,
				passwordHash: hashedPassword,
				role: 'USER' as UserRole
			}
		});

		// Generate token and set cookie
		const token = generateToken(user);
		cookies.set('auth_token', token, {
			path: '/',
			httpOnly: true,
			secure: true,
			sameSite: 'strict',
			maxAge: 60 * 60 * 24 * 7 // 7 days
		});

		return json({
			success: true,
			data: createAuthUser(user),
			message: 'Account created successfully'
		});
	} catch (error) {
		console.error('Registration error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
