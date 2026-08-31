import mariadb from 'mariadb';

import { DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME } from './config.js';

export const pool = mariadb.createPool({
	host: DB_HOST,
	port: DB_PORT,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME,
	charset: 'utf8mb4',
	connectionLimit: 5,
});

export default pool;
