import { json, type RequestEvent } from '@sveltejs/kit';
import { prisma } from '$lib/server/db';

export const GET = async ({ url }: RequestEvent) => {
	try {
		const searchParams = url.searchParams;
		const search = searchParams.get('search') || undefined;
		const region = searchParams.get('region') || undefined;

		const where: any = {};

		if (search) {
			where.OR = [
				{
					name: {
						contains: search
					}
				},
				{
					location: {
						contains: search
					}
				}
			];
		}

		if (region) {
			where.region = {
				contains: region
			};
		}

		const markets = await prisma.market.findMany({
			where,
			orderBy: { name: 'asc' }
		});

		return json({
			success: true,
			data: markets
		});
	} catch (error) {
		console.error('Markets fetch error:', error);
		return json(
			{ success: false, error: 'Internal server error' },
			{ status: 500 }
		);
	}
};
