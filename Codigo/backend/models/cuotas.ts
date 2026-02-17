import db from '../database.js';
import type { Filtro } from '../schemas/filtroSchema.js';

export interface CuotaRow {
	id: number;
	empresa: string;
	url: string;
	monto: number;
	fechaPago: string;
}

export default class Cuota {
	static async dameCuotas(filtro: Filtro): Promise<{ items: CuotaRow[]; itemCount: number }> {
		const [cuotas, meta] = await db.execute('CALL dameCuotas(?, ?, ?, ?)', [
			filtro.page,
			filtro.pageSize,
			filtro.sort,
			filtro.filter,
		]);

		const numeroFilas = meta?.[0]?.itemCount;
		const itemCount = Number(numeroFilas);

		return { items: cuotas as CuotaRow[], itemCount };
	}
}
