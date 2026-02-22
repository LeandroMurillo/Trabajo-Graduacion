import { firebaseAdminAuth } from './firebaseConfig.js';
import Postulante from '../models/postulantes.js';

type ErrorCode = string | null;

interface DecodedClaims {
	sub: string;
	uid?: string;
	user_id?: string;
	email?: string;
	email_verified?: boolean;
	name?: string;
	picture?: string;
	[id: string]: unknown;
}

interface SessionCookieData {
	sessionCookie: string;
	options: {
		maxAge: number;
		httpOnly: boolean;
		secure: boolean;
	};
}

export async function loginConToken(idToken: string): Promise<SessionCookieData> {
	try {
		const decoded = (await firebaseAdminAuth.verifyIdToken(String(idToken), true)) as DecodedClaims;

		const uidRaw = decoded.user_id || decoded.uid || decoded.sub || '';
		const uid = typeof uidRaw === 'string' ? uidRaw : String(uidRaw);

		if (!uid) {
			const e = new Error('UID_INVALIDO');
			(e as { code?: string }).code = 'UID_INVALIDO';
			throw e;
		}

		if (decoded.email_verified !== true) {
			const e = new Error('EMAIL_NO_VERIFICADO');
			(e as { code?: string }).code = 'EMAIL_NO_VERIFICADO';
			throw e;
		}

		const estado: 'P' | 'A' | 'I' = await Postulante.dameEstadoPostulante(uid);

		if (estado === 'I') {
			const e = new Error('POSTULANTE_INACTIVO');
			(e as { code?: string }).code = 'POSTULANTE_INACTIVO';
			throw e;
		}

		if (estado === 'P') {
			const mensaje = await Postulante.activarPostulante(uid);

			if (mensaje !== 'OK') {
				const e = new Error('NO_SE_PUDO_ACTIVAR_POSTULANTE');
				(e as { code?: string }).code = 'NO_SE_PUDO_ACTIVAR_POSTULANTE';
				throw e;
			}
		}

		const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
		const sessionCookie = await firebaseAdminAuth.createSessionCookie(String(idToken), {
			expiresIn,
		});

		const options: SessionCookieData['options'] = {
			maxAge: expiresIn,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};

		return { sessionCookie, options };
	} catch (err: unknown) {
		if (typeof err === 'object' && err !== null) {
			const e = err as {
				sqlState?: unknown;
				code?: unknown;
				message?: unknown;
				sqlMessage?: unknown;
			};

			if (e.sqlState === '45000' || e.code === 'ER_SIGNAL_EXCEPTION') {
				const msg =
					typeof e.message === 'string'
						? e.message
						: typeof e.sqlMessage === 'string'
							? e.sqlMessage
							: 'Error de base de datos';

				const out = new Error(msg);
				(out as { code?: string }).code = msg;
				throw out;
			}

			const message = typeof e.message === 'string' ? e.message : 'Error desconocido';
			const code = typeof e.code === 'string' ? e.code : null;

			const out = new Error(message);
			(out as { code?: ErrorCode }).code = code;
			throw out;
		}

		if (typeof err === 'string') {
			throw new Error(err);
		}

		throw new Error('Error desconocido');
	}
}

export async function verificarCookieDeSession(sessionCookie: string): Promise<DecodedClaims> {
	try {
		const decodedClaims = (await firebaseAdminAuth.verifySessionCookie(
			String(sessionCookie),
			true,
		)) as DecodedClaims;

		const uidRaw = decodedClaims.user_id || decodedClaims.uid || decodedClaims.sub || '';
		const uid = typeof uidRaw === 'string' ? uidRaw : String(uidRaw);

		if (!uid) {
			const e = new Error('SESSION_UID_INVALIDO');
			(e as { code?: string }).code = 'SESSION_UID_INVALIDO';
			throw e;
		}

		const estado: 'P' | 'A' | 'I' = await Postulante.dameEstadoPostulante(uid);

		if (estado === 'I') {
			const e = new Error('POSTULANTE_INACTIVO');
			(e as { code?: string }).code = 'POSTULANTE_INACTIVO';
			throw e;
		}

		if (estado === 'P') {
			const e = new Error('POSTULANTE_PENDIENTE');
			(e as { code?: string }).code = 'POSTULANTE_PENDIENTE';
			throw e;
		}

		return decodedClaims;
	} catch (err: unknown) {
		if (typeof err === 'object' && err !== null) {
			const e = err as {
				sqlState?: unknown;
				code?: unknown;
				message?: unknown;
				sqlMessage?: unknown;
			};

			if (e.sqlState === '45000' || e.code === 'ER_SIGNAL_EXCEPTION') {
				const msg =
					typeof e.message === 'string'
						? e.message
						: typeof e.sqlMessage === 'string'
							? e.sqlMessage
							: 'Error de base de datos';

				const out = new Error(msg);
				(out as { code?: string }).code = msg;
				throw out;
			}

			const message = typeof e.message === 'string' ? e.message : 'Error desconocido';
			const code = typeof e.code === 'string' ? e.code : null;

			const out = new Error(message);
			(out as { code?: ErrorCode }).code = code;
			throw out;
		}

		if (typeof err === 'string') {
			throw new Error(err);
		}

		throw new Error('Error desconocido');
	}
}

export async function revocarSesionPorCookie(sessionCookie: string): Promise<{ success: true }> {
	if (!sessionCookie) {
		const e = new Error('No hay token de sesión.');
		(e as { code?: string }).code = 'NO_SESSION_COOKIE';
		throw e;
	}

	const decodedClaims = (await firebaseAdminAuth.verifySessionCookie(
		String(sessionCookie),
		true,
	)) as DecodedClaims;

	const uidRaw = decodedClaims.user_id || decodedClaims.uid || decodedClaims.sub || '';
	const uid = typeof uidRaw === 'string' ? uidRaw : String(uidRaw);

	if (!uid) {
		const e = new Error('SESSION_UID_INVALIDO');
		(e as { code?: string }).code = 'SESSION_UID_INVALIDO';
		throw e;
	}

	await firebaseAdminAuth.revokeRefreshTokens(uid);

	return { success: true };
}
