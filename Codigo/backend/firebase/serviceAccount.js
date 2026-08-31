const rawServiceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

if (!rawServiceAccount) {
	throw new Error('La variable FIREBASE_SERVICE_ACCOUNT_JSON es obligatoria.');
}

let parsedServiceAccount;
try {
	parsedServiceAccount = JSON.parse(rawServiceAccount);
} catch {
	throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON debe contener JSON válido en una sola línea.');
}

for (const field of ['project_id', 'client_email', 'private_key']) {
	if (typeof parsedServiceAccount[field] !== 'string' || !parsedServiceAccount[field]) {
		throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON no contiene ${field}.`);
	}
}

export const serviceAccount = parsedServiceAccount;
