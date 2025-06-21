import type { PaginationInfo, PaginatedResponse } from '$lib/types';

export function createPaginatedResponse<T>(
	data: T[],
	page: number,
	limit: number,
	total: number
): PaginatedResponse<T> {
	return {
		data,
		pagination: {
			page,
			limit,
			total,
			totalPages: Math.ceil(total / limit)
		}
	};
}

export function calculatePagination(page: number = 1, limit: number = 10) {
	const skip = (page - 1) * limit;
	return { skip, take: limit };
}

export function formatPrice(price: number, currency = '₦'): string {
	return `${currency}${price.toLocaleString('en-NG')}`;
}

export function formatDate(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleDateString('en-NG', {
		year: 'numeric',
		month: 'short',
		day: 'numeric'
	});
}

export function formatDateTime(date: Date | string): string {
	const d = typeof date === 'string' ? new Date(date) : date;
	return d.toLocaleString('en-NG', {
		year: 'numeric',
		month: 'short',
		day: 'numeric',
		hour: '2-digit',
		minute: '2-digit'
	});
}

export function slugify(text: string): string {
	return text
		.toString()
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^\w\-]+/g, '')
		.replace(/\-\-+/g, '-')
		.replace(/^-+/, '')
		.replace(/-+$/, '');
}

export function generateId(): string {
	return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function validateEmail(email: string): boolean {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

export function validatePassword(password: string): { isValid: boolean; errors: string[] } {
	const errors: string[] = [];
	
	if (password.length < 8) {
		errors.push('Password must be at least 8 characters long');
	}
	
	if (!/[A-Z]/.test(password)) {
		errors.push('Password must contain at least one uppercase letter');
	}
	
	if (!/[a-z]/.test(password)) {
		errors.push('Password must contain at least one lowercase letter');
	}
	
	if (!/\d/.test(password)) {
		errors.push('Password must contain at least one number');
	}
	
	return {
		isValid: errors.length === 0,
		errors
	};
}

export function debounce<T extends (...args: any[]) => any>(
	func: T,
	wait: number
): (...args: Parameters<T>) => void {
	let timeout: ReturnType<typeof setTimeout>;
	return (...args: Parameters<T>) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), wait);
	};
}

export function truncateText(text: string, maxLength: number): string {
	if (text.length <= maxLength) return text;
	return text.substring(0, maxLength).trim() + '...';
}
