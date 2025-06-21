import { env } from '$env/dynamic/private';

export const JWT_SECRET = env.JWT_SECRET || 'your-super-secret-jwt-key-here';
export const DATABASE_URL = env.DATABASE_URL;
export const UPLOAD_MAX_SIZE = parseInt(env.UPLOAD_MAX_SIZE || '5000000');
export const UPLOAD_ALLOWED_TYPES = env.UPLOAD_ALLOWED_TYPES?.split(',') || [
	'image/jpeg',
	'image/png',
	'image/webp',
	'application/pdf'
];
