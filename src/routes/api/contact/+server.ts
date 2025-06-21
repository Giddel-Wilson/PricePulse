import { json, type RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const POST = async ({ request }: RequestEvent) => {
	try {
		const { name, email, subject, message } = await request.json();

		// Basic validation
		if (!name || !email || !subject || !message) {
			return json(
				{ success: false, error: 'All fields are required' },
				{ status: 400 }
			);
		}

		// Email validation
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		if (!emailRegex.test(email)) {
			return json(
				{ success: false, error: 'Please enter a valid email address' },
				{ status: 400 }
			);
		}

		// Message length validation
		if (message.length < 10) {
			return json(
				{ success: false, error: 'Message must be at least 10 characters long' },
				{ status: 400 }
			);
		}

		// Save contact message to database
		const contactMessage = await prisma.contactMessage.create({
			data: {
				name,
				email,
				subject,
				message,
				status: 'UNREAD'
			}
		});

		// Log the submission for debugging
		console.log('� Contact message saved to database:', {
			id: contactMessage.id,
			name,
			email,
			subject,
			timestamp: new Date().toISOString()
		});

		return json({
			success: true,
			message: 'Thank you for your message! We have received it and will get back to you soon.'
		});
	} catch (error) {
		console.error('Contact form error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
