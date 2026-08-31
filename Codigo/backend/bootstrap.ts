import bcrypt from 'bcryptjs';

import pool from './database.js';

async function bootstrapSuperadmin() {
	const rows = await pool.query(
		"SELECT idAdministrador FROM Administradores WHERE rol = 'SUPERADMIN' LIMIT 1",
	);

	if (rows.length > 0) {
		console.log('Bootstrap: ya existe un superadministrador.');
		return;
	}

	const email = process.env.BOOTSTRAP_SUPERADMIN_EMAIL?.trim().toLowerCase();
	const password = process.env.BOOTSTRAP_SUPERADMIN_PASSWORD;

	if (!email || !password) {
		throw new Error(
			'BOOTSTRAP_SUPERADMIN_EMAIL y BOOTSTRAP_SUPERADMIN_PASSWORD son obligatorias para inicializar la base.',
		);
	}

	if (password.length < 12) {
		throw new Error('BOOTSTRAP_SUPERADMIN_PASSWORD debe tener al menos 12 caracteres.');
	}

	const connection = await pool.getConnection();
	try {
		await connection.beginTransaction();

		const result = await connection.query(
			`INSERT INTO Empresas (empresa, url, estilo, estado, esSistema)
			 VALUES ('Plataforma', 'admin', NULL, 'A', 1)
			 ON DUPLICATE KEY UPDATE idEmpresa = LAST_INSERT_ID(idEmpresa)`,
		);
		const idEmpresa = Number(result.insertId);
		const passwordHash = await bcrypt.hash(password, 12);

		await connection.query(
			`INSERT INTO Administradores (idEmpresa, email, clave, rol)
			 VALUES (?, ?, ?, 'SUPERADMIN')`,
			[idEmpresa, email, passwordHash],
		);

		await connection.commit();
		console.log(`Bootstrap: superadministrador ${email} creado.`);
	} catch (error) {
		await connection.rollback();
		throw error;
	} finally {
		connection.release();
	}
}

bootstrapSuperadmin()
	.then(() => pool.end())
	.catch(async (error) => {
		console.error('No se pudo inicializar el superadministrador:', error);
		await pool.end();
		process.exit(1);
	});
