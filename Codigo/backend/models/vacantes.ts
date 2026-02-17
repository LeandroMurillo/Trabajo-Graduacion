import db from '../database.js';
import type { Filtro } from '../schemas/filtroSchema.js';
import type { EstadoVacante } from './types.ts';

export type TipoTrabajo =
	| 'Sin Especificar'
	| 'Tiempo Completo'
	| 'Medio Tiempo'
	| 'Remoto'
	| 'Híbrido';

export type Modalidad = 'Sin Especificar' | 'Presencial' | 'Remoto' | 'Híbrido';

export type NivelExperiencia = 'Junior' | 'SemiSenior' | 'Senior';

export interface VacantePostulante {
	id: number;
	categoria: string;
	titulo: string;
	descripcion: string | null;
	tipoTrabajo: TipoTrabajo | null;
	modalidad: Modalidad | null;
	fechaPublicacion: string | null;
	localidad: string | null;
	nivelExperiencia: NivelExperiencia | null;
	habilidades: string[];
}

export interface FiltroVacantes {
	categoria?: string | null;
	titulo?: string | null;
	offset?: number;
	limit?: number;
}

export interface VacanteAdmin {
	id: number;
	categoria: string;
	vacante: string;
	descripcion: string | null;
	tipoTrabajo: TipoTrabajo | null;
	modalidad: Modalidad | null;
	fechaCreacion: string;
	fechaPublicacion: string | null;
	fechaCierre: string | null;
	localidad: string | null;
	nivelExperiencia: NivelExperiencia | null;
	habilidades: string[];
	estado: EstadoVacante;
}

export interface AltaVacanteData {
	categoria: string;
	vacante: string;
	descripcion: string | null;
	tipoTrabajo: TipoTrabajo | null;
	modalidad: Modalidad | null;
	localidad: string | null;
	nivelExperiencia: NivelExperiencia | null;
	habilidades: string[] | string;
	estado: Exclude<EstadoVacante, 'C'>;
}

export interface ModificaVacanteData {
	categoria?: string | null;
	vacante?: string | null;
	descripcion?: string | null;
	tipoTrabajo?: TipoTrabajo | null;
	modalidad?: Modalidad | null;
	localidad?: string | null;
	nivelExperiencia?: NivelExperiencia | null;
	habilidades?: string[] | string;
	estado?: Exclude<EstadoVacante, 'B'> | null;
}

export default class Vacante {
	static async dameVacantes(
		idEmpresa: number,
		filtro?: FiltroVacantes,
	): Promise<{ items: VacantePostulante[]; itemCount: number }> {
		const { categoria = null, titulo = null, offset = 0, limit = 25 } = filtro ?? {};

		const [vacantes, meta] = await db.execute('CALL dameVacantes(?, ?, ?, ?, ?)', [
			idEmpresa,
			categoria,
			offset,
			limit,
			titulo,
		]);

		const numeroFilas = meta?.[0]?.itemCount;
		const itemCount = Number(numeroFilas);

		return { items: vacantes as VacantePostulante[], itemCount };
	}

	static async dameVacantesAvanzado(
		idEmpresa: number,
		filtro: Filtro,
	): Promise<{ items: VacanteAdmin[]; itemCount: number }> {
		const [vacantes, meta] = await db.execute('CALL dameVacantesAvanzado(?, ?, ?, ?, ?)', [
			idEmpresa,
			filtro.page,
			filtro.pageSize,
			filtro.sort,
			filtro.filter,
		]);

		const numeroFilas = meta?.[0]?.itemCount;
		const itemCount = Number(numeroFilas);

		return { items: vacantes as VacanteAdmin[], itemCount };
	}

	static async dameVacantePostulante(idEmpresa: number, id: number): Promise<VacantePostulante> {
		const [[vacanteDetalle]] = await db.execute('CALL dameVacantePostulante(?,?)', [idEmpresa, id]);
		if (!vacanteDetalle) throw new Error('VACANTE_NO_ENCONTRADA');
		return vacanteDetalle as VacantePostulante;
	}

	static async dameVacanteAdmin(idEmpresa: number, id: number): Promise<VacanteAdmin> {
		const [[vacanteAdmin]] = await db.execute('CALL dameVacanteAdmin(?,?)', [idEmpresa, id]);
		if (!vacanteAdmin) throw new Error('VACANTE_NO_ENCONTRADA');
		return vacanteAdmin as VacanteAdmin;
	}

	static async altaVacante(idEmpresa: number, data: AltaVacanteData): Promise<VacanteAdmin> {
		const {
			categoria,
			vacante,
			descripcion,
			tipoTrabajo,
			modalidad,
			localidad,
			nivelExperiencia,
			habilidades,
			estado,
		} = data;

		const [[nuevaVacante]] = await db.execute('CALL altaVacante(?,?,?,?,?,?,?,?,?,?)', [
			idEmpresa,
			categoria,
			vacante,
			descripcion,
			tipoTrabajo,
			modalidad,
			localidad,
			nivelExperiencia,
			habilidades,
			estado,
		]);

		if (!nuevaVacante) throw new Error('altaVacante no devolvió la vacante creada.');
		return nuevaVacante as VacanteAdmin;
	}

	static async modificaVacante(
		idEmpresa: number,
		id: number,
		data: ModificaVacanteData,
	): Promise<VacanteAdmin> {
		const {
			categoria = null,
			vacante = null,
			descripcion = null,
			tipoTrabajo = null,
			modalidad = null,
			localidad = null,
			nivelExperiencia = null,
			habilidades = null,
			estado = null,
		} = data;

		const [[vacanteModificada]] = await db.execute(
			'CALL modificaVacante(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
			[
				idEmpresa,
				id,
				categoria,
				vacante,
				descripcion,
				tipoTrabajo,
				modalidad,
				localidad,
				nivelExperiencia,
				habilidades,
				estado,
			],
		);

		if (!vacanteModificada) throw new Error('VACANTE_NO_ENCONTRADA');

		return vacanteModificada as VacanteAdmin;
	}

	static async borraVacante(idEmpresa: number, id: number): Promise<void> {
		await db.execute('CALL borraVacante(?, ?)', [idEmpresa, id]);
	}
}
