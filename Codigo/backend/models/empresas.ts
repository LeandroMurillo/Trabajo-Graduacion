import type { z } from 'zod';
import db from '../database.js';
import { estiloEmpresaSchema } from '../schemas/empresaSchema.js';

export type EstiloEmpresa = z.infer<typeof estiloEmpresaSchema> | null;

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
	static async dameEmpresas(soloActivas = false): Promise<EmpresaRow[]> {
		const [empresas] = await db.execute('CALL dameEmpresas(?)', [soloActivas ? 1 : 0]);
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

		if (!empresaCreada) throw new Error('ALTA_EMPRESA_SIN_RESULTADO');

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

	static async cambiarEstadoEmpresa(id: number, estado: EstadoEmpresa): Promise<void> {
		await db.execute('CALL cambiarEstadoEmpresa(?, ?)', [id, estado]);
	}

	static async borraEmpresa(id: number): Promise<void> {
		await db.execute('CALL borraEmpresa(?)', [id]);
	}

	static async dameEstiloEmpresa(idEmpresa: number): Promise<EstiloEmpresa> {
		const [[row]] = await db.execute('CALL dameEstiloEmpresa(?)', [idEmpresa]);

		const estilo = (row as { estilo: unknown }).estilo;
		return estilo == null ? null : estiloEmpresaSchema.parse(estilo);
	}

	static async modificaEstiloEmpresa(
		idEmpresa: number,
		estilo: EstiloEmpresa,
	): Promise<EstiloEmpresa> {
		const [[row]] = await db.execute('CALL modificaEstiloEmpresa(?, ?)', [
			idEmpresa,
			estilo == null ? null : JSON.stringify(estilo),
		]);

		const saved = (row as { estilo: unknown }).estilo;
		return saved == null ? null : estiloEmpresaSchema.parse(saved);
	}
}
