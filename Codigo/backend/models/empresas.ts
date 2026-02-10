import db from '../database.js';
import { ResultadoMensajeRow, EstiloEmpresa } from './types.js';

export type EstadoEmpresa = 'A' | 'I';

export interface EmpresaRow {
	id: number;
	empresa: string;
	url: string;
	estado: EstadoEmpresa;
}

export interface EmpresaData {
	empresa: string;
	url: string;
}

export interface DameEmpresaPorSlugData {
	idEmpresa: number;
	estado: EstadoEmpresa;
}

export default class Empresa {
	static async dameEmpresas(): Promise<EmpresaRow[]> {
		const [empresas] = await db.execute('CALL dameEmpresas()', []);
		return empresas as EmpresaRow[];
	}

	static async dameEmpresa(id: number): Promise<EmpresaRow> {
		const [[empresa]] = await db.execute('CALL dameEmpresa(?)', [id]);

		if (!empresa) {
			const err = new Error('EMPRESA_NO_ENCONTRADA');
			err.name = 'NOT_FOUND';
			throw err;
		}

		return empresa as EmpresaRow;
	}

	static async dameEmpresaPorSlug(slug: string): Promise<DameEmpresaPorSlugData> {
		const [[empresaData]] = await db.execute('CALL dameEmpresaPorSlug(?)', [slug]);

		if (!empresaData) {
			const err = new Error('EMPRESA_NO_ENCONTRADA');
			err.name = 'NOT_FOUND';
			throw err;
		}

		return empresaData as DameEmpresaPorSlugData;
	}

	static async dameNombreEmpresa(idEmpresa: number): Promise<string> {
		const [[row]] = await db.execute('CALL dameNombreEmpresaUsuario(?)', [idEmpresa]);

		if (!row) {
			const err = new Error('EMPRESA_NO_ENCONTRADA');
			err.name = 'NOT_FOUND';
			throw err;
		}

		return (row as { empresa: string }).empresa;
	}

	static async altaEmpresa(data: EmpresaData): Promise<EmpresaRow> {
		const { empresa, url } = data;

		const [[empresaCreada]] = await db.execute('CALL altaEmpresa(?, ?)', [empresa, url]);

		if (!empresaCreada) {
			throw new Error('ALTA_EMPRESA_SIN_RESULTADO');
		}

		return empresaCreada as EmpresaRow;
	}

	static async modificaEmpresa(id: number, data: EmpresaData): Promise<EmpresaRow> {
		const { empresa, url } = data;

		const [[empresaActualizada]] = await db.execute('CALL modificaEmpresa(?, ?, ?)', [
			id,
			empresa,
			url,
		]);

		if (!empresaActualizada) {
			const err = new Error('EMPRESA_NO_ENCONTRADA');
			err.name = 'NOT_FOUND';
			throw err;
		}

		return empresaActualizada as EmpresaRow;
	}

	static async cambiarEstadoEmpresa(
		id: number,
		estado: EstadoEmpresa,
	): Promise<ResultadoMensajeRow> {
		const [[row]] = await db.execute('CALL cambiarEstadoEmpresa(?, ?)', [id, estado]);
		return row as ResultadoMensajeRow;
	}

	static async borraEmpresa(id: number): Promise<void> {
		await db.execute('CALL borraEmpresa(?)', [id]);
	}

	static async dameEstiloEmpresa(idEmpresa: number): Promise<EstiloEmpresa> {
		const [[row]] = await db.execute('CALL dameEstiloEmpresa(?)', [idEmpresa]);

		if (!row) {
			const err = new Error('EMPRESA_NO_ENCONTRADA');
			err.name = 'NOT_FOUND';
			throw err;
		}

		const raw = (row as { estilo: unknown }).estilo;

		if (raw == null) return null;
		if (typeof raw === 'string') return JSON.parse(raw) as EstiloEmpresa;

		return raw as EstiloEmpresa;
	}

	static async modificaEstiloEmpresa(
		idEmpresa: number,
		estilo: EstiloEmpresa,
	): Promise<ResultadoMensajeRow> {
		const [[row]] = await db.execute('CALL modificaEstiloEmpresa(?, ?)', [idEmpresa, estilo]);

		if (!row) throw new Error('SP_SIN_RESULTADO');
		return row as ResultadoMensajeRow;
	}
}
