import {
	setPersistence,
	browserSessionPersistence,
	sendEmailVerification,
	createUserWithEmailAndPassword,
	updateProfile,
	signOut,
	sendPasswordResetEmail,
	verifyPasswordResetCode,
	confirmPasswordReset,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';
import { apiUrl, parseErrorMessage } from '../api';

type ErrorCode = string | null;

export interface FormularioRegistroData {
	nombres: string;
	apellidos: string;
	email: string;
	contraseña: string;
	fechaNacimiento: string; // YYYY-MM-DD
	genero: string; // M | F | X
}

function parseFirebaseError(error: unknown, fallback: string): { error: string; code: ErrorCode } {
	if (typeof error === 'object' && error !== null) {
		const e = error as { message?: unknown; code?: unknown };
		return {
			error: typeof e.message === 'string' ? e.message : fallback,
			code: typeof e.code === 'string' ? e.code : null,
		};
	}

	if (typeof error === 'string') {
		return { error, code: null };
	}

	return { error: fallback, code: null };
}

async function firebaseSignOut(contexto: string): Promise<void> {
	try {
		await signOut(firebaseAuth);
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'No se pudo cerrar la sesión local');
		console.warn(`[auth] ${contexto}: ${parsed.error}`, { code: parsed.code });
	}
}

export async function registrarPostulante(data: FormularioRegistroData): Promise<{
	message: string;
	emailVerificado?: boolean;
}> {
	const email = String(data.email).trim().toLowerCase();
	const password = String(data.contraseña);
	const displayName = `${data.nombres} ${data.apellidos}`.trim();

	// 1) Crear cuenta en Firebase + displayName
	try {
		await setPersistence(firebaseAuth, browserSessionPersistence);

		const userCredential = await createUserWithEmailAndPassword(firebaseAuth, email, password);

		if (displayName) {
			await updateProfile(userCredential.user, { displayName });
		}
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'No se pudo crear la cuenta.');
		throw new Error(parsed.error);
	}

	// 2) Enviar correo de verificación
	try {
		const user = firebaseAuth.currentUser;

		if (!user) {
			await firebaseSignOut('registro: usuario nulo luego de createUser');
			throw new Error('No hay ningún usuario autenticado luego del registro.');
		}

		const parts = window.location.pathname.split('/').filter(Boolean);
		const empresa = parts[0] ?? '';
		const base = empresa ? `/${empresa}` : '';

		await sendEmailVerification(user, {
			url: `${window.location.origin}${base}/login`,
			handleCodeInApp: true,
		});
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'No se pudo enviar el correo de verificación.');
		await firebaseSignOut('registro: fallo sendEmailVerification');
		throw new Error(parsed.error);
	}

	// 3) Obtener idToken
	let idToken: string;
	try {
		const user = firebaseAuth.currentUser;

		if (!user) {
			await firebaseSignOut('registro: usuario nulo al pedir idToken');
			throw new Error('No hay un usuario autenticado.');
		}

		idToken = await user.getIdToken(true);
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'No se pudo obtener el token de autenticación.');
		await firebaseSignOut('registro: fallo getIdToken');
		throw new Error(parsed.error);
	}

	// 4) Persistir en backend (sin email/contraseña)
	const res = await fetch(apiUrl('/api/registro'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({
			nombres: data.nombres.trim(),
			apellidos: data.apellidos.trim(),
			fechaNacimiento: data.fechaNacimiento,
			genero: data.genero,
			idToken,
		}),
	});

	if (!res.ok) {
		await firebaseSignOut('registro: backend /api/registro respondió error');
		throw new Error(await parseErrorMessage(res, 'Error al registrar usuario'));
	}

	const json = (await res.json()) as {
		message: string;
		emailVerificado?: boolean;
	};

	// 5) Cerrar sesión local para forzar flujo "verificar correo -> login"
	await firebaseSignOut('registro: cierre final post éxito');

	return json;
}

export async function enviarRestablecerContraseña({
	email,
	empresa,
}: {
	email: string;
	empresa: string;
}): Promise<{ message: string }> {
	try {
		const emailNormalizado = String(email).trim().toLowerCase();
		const empresaLimpia = String(empresa).trim();

		await sendPasswordResetEmail(firebaseAuth, emailNormalizado, {
			url: `${window.location.origin}/${empresaLimpia}/login`,
			handleCodeInApp: true,
		});

		return {
			message: 'Si el correo existe, te enviamos un enlace para restablecer tu contraseña.',
		};
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'No se pudo enviar el correo de recuperación.');
		throw new Error(parsed.error);
	}
}

export async function validarResetCode(oobCode: string): Promise<{ email: string }> {
	try {
		const code = String(oobCode).trim();
		if (!code) {
			throw new Error('Código de recuperación inválido.');
		}

		const email = await verifyPasswordResetCode(firebaseAuth, code);

		return { email };
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'Link inválido o expirado.');
		throw new Error(parsed.error);
	}
}

export async function confirmarNuevaContraseña(
	oobCode: string,
	nuevaContraseña: string,
): Promise<{ message: string }> {
	try {
		const code = String(oobCode).trim();
		const password = String(nuevaContraseña);

		if (!code) {
			throw new Error('Código de recuperación inválido.');
		}

		if (!password || password.length < 6) {
			throw new Error('La contraseña debe tener al menos 6 caracteres.');
		}

		await confirmPasswordReset(firebaseAuth, code, password);

		return {
			message: 'Contraseña actualizada correctamente.',
		};
	} catch (error: unknown) {
		const parsed = parseFirebaseError(error, 'No se pudo restablecer la contraseña.');
		throw new Error(parsed.error);
	}
}
