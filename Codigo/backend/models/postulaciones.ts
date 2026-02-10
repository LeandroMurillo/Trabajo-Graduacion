import db from '../database.js';
import { EstadoVacante } from './types.js';

export interface PostulacionAdmin {
	id: number;
	idPostulante: string;
	vacante: string;
	postulante: string;
	fechaPostulacion: Date;
	localidadPostulante: string | null;
}

export interface PostulacionPostulante {
	id: number;
	idVacante: number;
	titulo: string;
	categoria: string;
	fecha: string;
	estado: EstadoVacante;
}
export interface AltaPostulacionData {
	idEmpresa: number;
	idVacante: number;
	idPostulante: string;
}

export interface BorraPostulacionData {
	idEmpresa: number;
	idPostulacion: number;
	idPostulante: string;
}

export type FiltroPostulaciones =
	| { por: 'vacante'; idEmpresa: number; idVacante: number }
	| { por: 'postulante'; idEmpresa: number; idPostulante: string };

export default class Postulacion {
	static async damePostulaciones(filtro: FiltroPostulaciones): Promise<PostulacionAdmin[]> {
		const pIdVacante = filtro.por === 'vacante' ? filtro.idVacante : null;
		const pIdPostulante = filtro.por === 'postulante' ? filtro.idPostulante : null;

		const [rows] = await db.execute<PostulacionAdmin[]>('CALL damePostulaciones(?, ?, ?)', [
			filtro.idEmpresa,
			pIdVacante,
			pIdPostulante,
		]);

		return Array.isArray(rows) ? rows : [];
	}

	static async dameMisPostulaciones(
		idEmpresa: number,
		idPostulante: string,
	): Promise<PostulacionPostulante[]> {
		const [rows] = await db.execute<PostulacionPostulante[]>('CALL dameMisPostulaciones(?, ?)', [
			idEmpresa,
			idPostulante,
		]);

		return Array.isArray(rows) ? rows : [];
	}

	static async altaPostulacion(data: AltaPostulacionData): Promise<PostulacionPostulante> {
		const { idEmpresa, idVacante, idPostulante } = data;

		const [[postulacionCreada]] = await db.execute('CALL altaPostulacion(?, ?, ?)', [
			idEmpresa,
			idVacante,
			idPostulante,
		]);

		if (!postulacionCreada) {
			throw new Error('ALTA_POSTULACION_SIN_RESULTADO');
		}

		return postulacionCreada as PostulacionPostulante;
	}

	static async borraPostulacion(data: BorraPostulacionData): Promise<void> {
		const { idEmpresa, idPostulacion, idPostulante } = data;

		await db.execute('CALL borraPostulacion(?, ?, ?)', [idEmpresa, idPostulacion, idPostulante]);
	}
}
