import db from '../database.js';
import type { EstadoCategoria } from './types.ts';

export interface CategoriaRow {
	id: number;
	categoria: string;
	estado: EstadoCategoria;
	orden: number;
}

export interface AltaCategoriaData {
	categoria: string;
}

export interface ModificaCategoriaData {
	categoria: string;
	orden: number;
}

type MensajeResultRow = { mensaje: string };

export default class Categoria {
	static async dameCategorias(
		idEmpresa: number,
		estado: EstadoCategoria | null = null,
	): Promise<CategoriaRow[]> {
		const [categorias] = await db.execute('CALL dameCategorias(?, ?)', [idEmpresa, estado]);
		return Array.isArray(categorias) ? (categorias as CategoriaRow[]) : [];
	}

	static async dameCategoria(idEmpresa: number, id: number): Promise<CategoriaRow> {
		const [[categoria]] = await db.execute('CALL dameCategoria(?, ?)', [idEmpresa, id]);
		return categoria as CategoriaRow;
	}

	static async altaCategoria(idEmpresa: number, data: AltaCategoriaData): Promise<CategoriaRow> {
		const { categoria } = data;

		const [[categoriaCreada]] = await db.execute('CALL altaCategoria(?, ?)', [
			idEmpresa,
			categoria,
		]);

		return categoriaCreada as CategoriaRow;
	}

	static async modificaCategoria(
		idEmpresa: number,
		id: number,
		data: ModificaCategoriaData,
	): Promise<CategoriaRow> {
		const { categoria, orden } = data;

		const [[row]] = await db.execute('CALL modificaCategoria(?, ?, ?, ?)', [
			idEmpresa,
			id,
			categoria,
			orden,
		]);

		return row as CategoriaRow;
	}

	static async cambiarEstadoCategoria(
		idEmpresa: number,
		id: number,
		estado: EstadoCategoria,
	): Promise<string> {
		const [[resultado]] = (await db.execute('CALL cambiarEstadoCategoria(?, ?, ?)', [
			idEmpresa,
			id,
			estado,
		])) as unknown as [[MensajeResultRow]];

		const mensaje = resultado?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}

	static async borraCategoria(idEmpresa: number, id: number): Promise<void> {
		await db.execute('CALL borraCategoria(?, ?)', [idEmpresa, id]);
	}
}
