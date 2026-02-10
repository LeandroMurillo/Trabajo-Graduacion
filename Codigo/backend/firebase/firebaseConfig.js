import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import {
	FIREBASE_API_KEY,
	FIREBASE_AUTH_DOMAIN,
	FIREBASE_PROJECT_ID,
	FIREBASE_STORAGE_BUCKET,
	FIREBASE_MESSAGE_SENDER_ID,
	FIREBASE_APP_ID,
} from '../config.js';

import { initializeApp as initializeAppAdmin, cert } from 'firebase-admin/app';
import { getAuth as getAdminAuth } from 'firebase-admin/auth';
import { serviceAccount } from './serviceAccount.js';

const appAdmin = initializeAppAdmin({
	credential: cert(serviceAccount),
});
const app = initializeApp({
	apiKey: FIREBASE_API_KEY,
	authDomain: FIREBASE_AUTH_DOMAIN,
	projectId: FIREBASE_PROJECT_ID,
	storageBucket: FIREBASE_STORAGE_BUCKET,
	messagingSenderId: FIREBASE_MESSAGE_SENDER_ID,
	appId: FIREBASE_APP_ID,
});

export const firebaseAuth = getAuth(app);
export const firebaseAdminAuth = getAdminAuth(appAdmin);
