import {
	signInWithEmailAndPassword,
	//signOut,
	sendEmailVerification,
	applyActionCode,
} from 'firebase/auth';
import { firebaseAuth, firebaseAdminAuth } from './firebaseConfig.js';
import Postulante from '../models/postulantes.ts';

export async function crearUsuarioConCorreoYContraseña(email, password, extra = {}) {
	try {
		const emailNorm = String(email).trim().toLowerCase();

		const userRecord = await firebaseAdminAuth.createUser({
			email: emailNorm,
			password,
			emailVerified: false,
			displayName: extra?.displayName ? String(extra.displayName).trim() : undefined,
		});

		return { success: true, idPostulante: userRecord.uid, error: null, code: null };
	} catch (error) {
		return {
			success: false,
			idPostulante: null,
			error: error?.message ?? 'Failed to create user',
			code: error?.code,
		};
	}
}

export async function enviarCorreoDeVerificacion() {
	try {
		if (firebaseAuth.currentUser) {
			await sendEmailVerification(firebaseAuth.currentUser);
			return { correoEnviado: true };
		} else {
			throw new Error('No hay ningún usuario logueado');
		}
	} catch (error) {
		return {
			correoEnviado: false,
			error: error instanceof Error ? error.message : 'No se pudo enviar el correo de verificación',
		};
	}
}

export async function verificarCorreoUsuario(actionCode) {
	try {
		await applyActionCode(firebaseAuth, actionCode);
		return { correoVerificado: true, error: null };
	} catch (error) {
		return {
			correoVerificado: false,
			error: error instanceof Error ? error.message : 'No se pudo verificar el correo',
		};
	}
}

export async function loginConCredenciales(idEmpresa, email, contraseña) {
	try {
		const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, contraseña);

		const uid = userCredential.user.uid;

		const estado = await Postulante.dameEstadoPostulante(uid);

		if (estado === 'I') {
			const err = new Error('POSTULANTE_INACTIVO');
			err.code = 'POSTULANTE_INACTIVO';
			throw err;
		}

		await firebaseAdminAuth.setCustomUserClaims(uid, { idEmpresa });

		const idToken = await userCredential.user.getIdToken(true);

		const expiresIn = 60 * 60 * 24 * 5 * 1000; // 5 días
		const sessionCookie = await firebaseAdminAuth.createSessionCookie(idToken, { expiresIn });

		const options = {
			maxAge: expiresIn,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
		};

		return { sessionCookie, options };
	} catch (error) {
		if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
			const msg = String(error?.message ?? error?.sqlMessage ?? '');
			error.code = msg;
		}

		throw error;
	}
}

export async function verificarCookieDeSession(sessionCookie) {
	try {
		const decodedClaims = await firebaseAdminAuth.verifySessionCookie(sessionCookie, true);

		const uid = decodedClaims.sub;

		const estado = await Postulante.dameEstadoPostulante(uid);
		if (estado === 'I') {
			const err = new Error('POSTULANTE_INACTIVO');
			err.code = 'POSTULANTE_INACTIVO';
			throw err;
		}

		return decodedClaims;
	} catch (error) {
		if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
			const msg = String(error?.message ?? error?.sqlMessage ?? '');
			error.code = msg;
		}

		throw error;
	}
}

export async function revocarSesionPorCookie(sessionCookie) {
	if (!sessionCookie) {
		throw new Error('No hay token de sesión.');
	}

	const decodedClaims = await firebaseAdminAuth.verifySessionCookie(sessionCookie, true);
	await firebaseAdminAuth.revokeRefreshTokens(decodedClaims.sub);

	return { success: true };
}
