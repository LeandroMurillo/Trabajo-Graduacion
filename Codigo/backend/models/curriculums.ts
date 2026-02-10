import db from '../database.js';
import { ResultadoMensajeRow } from './types.js';

export interface CurriculumRow {
	mensaje: 'OK';
	nombre: string;
	pdf: Buffer;
}

interface AltaCurriculumData {
	idPostulante: string;
	nombre: string;
	hash: string;
	archivo: Buffer;
}

export default class Curriculum {
	static async dameCurriculum(idPostulante: string): Promise<CurriculumRow> {
		const [[curriculum]] = await db.execute('CALL dameCurriculum(?)', [idPostulante]);
		return curriculum as CurriculumRow;
	}

	static async dameCurriculumPorPostulacion(
		idEmpresa: number,
		idPostulacion: number,
	): Promise<CurriculumRow> {
		const [[row]] = await db.execute('CALL dameCurriculumPorPostulacion(?, ?)', [
			idEmpresa,
			idPostulacion,
		]);

		return row as CurriculumRow;
	}

	static async altaCurriculum(data: AltaCurriculumData): Promise<string> {
		const [[resultado]] = await db.execute('CALL altaCurriculum(?, ?, ?, ?)', [
			data.idPostulante,
			data.nombre,
			data.hash,
			data.archivo,
		]);

		const mensaje = (resultado as ResultadoMensajeRow | undefined)?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}
}
