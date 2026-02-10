import db from '../database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export type RolAdministrador = 'ADMIN' | 'SUPERADMIN';
export type EstadoEmpresa = 'A' | 'I';
export type EsSistema = 0 | 1;

export interface AdministradorRow {
	id: number;
	email: string;
	empresa: string;
	rol: RolAdministrador;
}

export interface AdminLoginRow {
	idAdministrador: number;
	idEmpresa: number;

	email: string;
	clave: string;
	rol: RolAdministrador;

	empresa: string;
	empresaSlug: string;

	estado: EstadoEmpresa;
	esSistema: EsSistema;
}

export interface AdminAuthResult {
	token: string;
	usuario: {
		id: number;
		email: string;
		rol: RolAdministrador;
		idEmpresa: number | null;
	};
	empresaSlug: string;
}

export interface AltaAdministradorData {
	email: string;
	empresa: string;
	claveHash: string;
}

export interface ModificaAdministradorData {
	email?: string;
	empresa?: string;
	claveHash?: string;
}

export default class Administrador {
	static async loginAdmin(email: string, password: string): Promise<AdminAuthResult | null> {
		const [[adminRow]] = await db.execute('CALL loginAdmin(?)', [email]);
		const admin = (adminRow ?? null) as AdminLoginRow | null;
		if (!admin) return null;

		const ok = await bcrypt.compare(password, admin.clave);
		if (!ok) return null;

		const payload = {
			idAdmin: admin.idAdministrador,
			idEmpresa: admin.idEmpresa ?? null,
			email: admin.email,
			rol: admin.rol,
		};

		const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '12h' });

		return {
			token,
			usuario: {
				id: admin.idAdministrador,
				email: admin.email,
				rol: admin.rol,
				idEmpresa: admin.idEmpresa ?? null,
			},
			empresaSlug: admin.empresaSlug,
		};
	}

	static async dameAdministradores(): Promise<AdministradorRow[]> {
		const [administradores] = await db.execute('CALL dameAdministradores()', []);
		return Array.isArray(administradores) ? (administradores as AdministradorRow[]) : [];
	}

	static async dameAdministrador(id: number): Promise<AdministradorRow> {
		const [[administrador]] = await db.execute('CALL dameAdministrador(?)', [id]);

		if (!administrador) {
			throw new Error('ADMIN_NO_EXISTE');
		}

		return administrador as AdministradorRow;
	}

	static async altaAdministrador(data: AltaAdministradorData): Promise<AdministradorRow> {
		const { email, empresa, claveHash } = data;

		const [[administrador]] = await db.execute('CALL altaAdministrador(?, ?, ?)', [
			email,
			empresa,
			claveHash,
		]);

		if (!administrador) {
			throw new Error('ALTA_ADMINISTRADOR_SIN_RESULTADO');
		}

		return administrador as AdministradorRow;
	}

	static async modificaAdministrador(
		id: number,
		data: ModificaAdministradorData,
	): Promise<AdministradorRow> {
		const email = (data.email ?? '').trim();
		const empresa = (data.empresa ?? '').trim();
		const claveHash = (data.claveHash ?? '').trim();

		const pEmail = email ? email : null;
		const pEmpresa = empresa ? empresa : null;
		const pClaveHash = claveHash ? claveHash : null;

		const [[empresaModificada]] = await db.execute('CALL modificaAdministrador(?, ?, ?, ?)', [
			id,
			pEmail,
			pEmpresa,
			pClaveHash,
		]);

		if (!empresaModificada) {
			throw new Error('MODIFICA_ADMINISTRADOR_SIN_RESULTADO');
		}

		return empresaModificada as AdministradorRow;
	}

	static async borraAdministrador(id: number): Promise<void> {
		await db.execute('CALL borraAdministrador(?)', [id]);
	}
}
