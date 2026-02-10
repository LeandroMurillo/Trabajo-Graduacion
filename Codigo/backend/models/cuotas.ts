// src/models/Cuota.ts
import db from '../database.js';
import type { SortDir } from './types.ts';

export type CuotaSortBy = 'idCuota' | 'idEmpresa' | 'empresa' | 'monto' | 'fechaPago';

export interface CuotaRow {
	idCuota: number;
	idEmpresa: number;
	empresa: string;
	monto: string;
	fechaPago: string;
}

export default class Cuota {
	static async dameCuotas(
		idEmpresa: number | null = null,
		page = 1,
		pageSize = 25,
		sortBy: CuotaSortBy | null = null,
		sortDir: SortDir = 'desc',
	): Promise<CuotaRow[]> {
		const [cuotas] = await db.execute('CALL dameCuotas(?, ?, ?, ?, ?)', [
			idEmpresa,
			page,
			pageSize,
			sortBy,
			sortDir,
		]);

		return Array.isArray(cuotas) ? (cuotas as CuotaRow[]) : [];
	}
}
