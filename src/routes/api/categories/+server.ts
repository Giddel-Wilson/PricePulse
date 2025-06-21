import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const GET = async ({ url }: RequestEvent) => {
	try {
		const searchParams = url.searchParams;
		const search = searchParams.get('search') || undefined;

		const where: any = {};

		if (search) {
			where.name = {
				contains: search
			};
		}

		const categories = await prisma.category.findMany({
			where,
			orderBy: { name: 'asc' }
		});

		return json({
			success: true,
			data: categories
		});
	} catch (error) {
		console.error('Categories fetch error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
