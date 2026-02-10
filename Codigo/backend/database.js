import mariadb from 'mariadb';

import { DB_HOST, DB_USER, DB_PASSWORD, DB_NAME } from './config.js';

export const pool = mariadb.createPool({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	charset: 'utf8mb4',
	connectionLimit: 5,
});

async function testConnection() {
	let conn;
	try {
		conn = await pool.getConnection();
		console.log('Conectado a la base de datos');
	} catch (err) {
		console.error('No se pudo conectar a la base de datos', err);
	} finally {
		if (conn) conn.release(); // libera la conexión al pool
	}
}

testConnection();

export default pool;
