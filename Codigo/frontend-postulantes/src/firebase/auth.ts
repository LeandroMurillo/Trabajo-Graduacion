import {
	setPersistence,
	browserSessionPersistence,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { firebaseAuth } from './firebaseConfig';

export async function signInWithCredentials(email: string, password: string) {
	try {
		await setPersistence(firebaseAuth, browserSessionPersistence);

		const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

		return {
			success: true,
			user: userCredential.user,
			error: null,
		};
	} catch (error: unknown) {
		return {
			success: false,
			user: null,
			error: error instanceof Error ? error.message : 'Failed to sign in with email/password',
		};
	}
}

export const firebaseSignOut = async () => {
	try {
		await signOut(firebaseAuth);
		return { success: true };
	} catch (error: unknown) {
		return {
			success: false,
			error: error instanceof Error ? error.message : 'An unknown error occurred',
		};
	}
};
