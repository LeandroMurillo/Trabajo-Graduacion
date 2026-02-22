import { initializeApp as initializeAppAdmin, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { serviceAccount } from './serviceAccount.js';

const appAdmin = initializeAppAdmin({
	credential: cert(serviceAccount),
});

export const firebaseAdminAuth = getAdminAuth(appAdmin);
