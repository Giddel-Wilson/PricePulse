import { json, type RequestEvent } from '@sveltejs/kit';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const GET = async ({ url }: RequestEvent) => {
	try {
		const status = url.searchParams.get('status');
		const search = url.searchParams.get('search');

		let where: any = {};

		if (status && status !== 'ALL') {
			where.status = status;
		}

		if (search) {
			where.OR = [
				{ name: { contains: search, mode: 'insensitive' } },
				{ email: { contains: search, mode: 'insensitive' } },
				{ subject: { contains: search, mode: 'insensitive' } }
			];
		}

		const messages = await prisma.contactMessage.findMany({
			where,
			orderBy: { createdAt: 'desc' }
		});

		return json({ messages });
	} catch (error) {
		console.error('Error fetching contact messages:', error);
		const errorMessage = error instanceof Error ? error.message : 'Unknown error';
		return json(
			{ error: 'Failed to fetch contact messages', details: errorMessage },
			{ status: 500 }
		);
	} finally {
		await prisma.$disconnect();
	}
};
