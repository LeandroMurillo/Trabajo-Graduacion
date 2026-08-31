function requireEnv(name) {
	const value = process.env[name]?.trim();
	if (!value) {
		throw new Error(`La variable de entorno ${name} es obligatoria.`);
	}
	return value;
}

function positiveInteger(name, fallback) {
	const raw = process.env[name] ?? String(fallback);
	const value = Number.parseInt(raw, 10);
	if (!Number.isInteger(value) || value <= 0) {
		throw new Error(`La variable de entorno ${name} debe ser un entero positivo.`);
	}
	return value;
}

export const NODE_ENV = process.env.NODE_ENV ?? 'development';
export const PORT = positiveInteger('PORT', 3000);
export const DB_HOST = requireEnv('DB_HOST');
export const DB_PORT = positiveInteger('DB_PORT', 3306);
export const DB_USER = requireEnv('DB_USER');
export const DB_PASSWORD = requireEnv('DB_PASSWORD');
export const DB_NAME = requireEnv('DB_DATABASE');
export const JWT_SECRET = requireEnv('JWT_SECRET');

if (DB_NAME !== 'proyecto') {
	throw new Error('DB_DATABASE debe ser "proyecto" porque los scripts SQL usan ese esquema.');
}

if (NODE_ENV === 'production' && JWT_SECRET.length < 32) {
	throw new Error('JWT_SECRET debe tener al menos 32 caracteres en producción.');
}

export const APP_ORIGINS = (process.env.APP_ORIGINS ?? 'http://trabajo.com,http://trabajo.com:5173')
	.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);
