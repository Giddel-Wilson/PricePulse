import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config';
import type { AuthUser, JWTPayload, UserRole, UserStatus } from '$lib/types';
import type { User } from '@prisma/client';

export async function hashPassword(password: string): Promise<string> {
	return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
	return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user: User): string {
	const payload: Omit<JWTPayload, 'iat' | 'exp'> = {
		userId: user.id,
		email: user.email,
		role: user.role as UserRole
	};

	return jwt.sign(payload, JWT_SECRET, {
		expiresIn: '7d'
	});
}

export function verifyToken(token: string): JWTPayload | null {
	try {
		return jwt.verify(token, JWT_SECRET) as JWTPayload;
	} catch {
		return null;
	}
}

export function createAuthUser(user: User): AuthUser {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		role: user.role as UserRole,
		status: user.status as UserStatus
	};
}
