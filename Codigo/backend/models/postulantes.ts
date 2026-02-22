import db from '../database.js';

export type Genero = 'M' | 'F' | 'X';
export type EstadoPostulante = 'P' | 'A' | 'I';

export interface PostulanteListRow {
	id: string;
	nombres: string;
	apellidos: string;
	email: string;
	cuil: string | null;
	fechaNacimiento: string;
	genero: Genero;
	localidad: string | null;
	telefono: string | null;
	observaciones: string | null;
	habilidades: string[];
	estado: EstadoPostulante;
}

export interface PostulanteRow {
	nombres: string;
	apellidos: string;
	email: string;
	cuil: string | null;
	genero: Genero;
	fechaNacimiento: string;
	localidad: string | null;
	telefono: string | null;
	habilidades: string[] | null;
}

interface AltaPostulanteData {
	id: string;
	nombres: string;
	apellidos: string;
	email: string;
	genero: Genero;
	fechaNacimiento: string;
}

interface ModificaPostulanteData {
	id: string;
	nombres?: string | null;
	apellidos?: string | null;
	cuil?: string | null;
	genero?: Genero | null;
	localidad?: string | null;
	telefono?: string | null;
	habilidades?: string[] | null;
}

export default class Postulante {
	static async damePostulantes(idEmpresa: number): Promise<PostulanteListRow[]> {
		const [postulantes] = await db.execute('CALL damePostulantes(?)', [idEmpresa]);
		return Array.isArray(postulantes) ? (postulantes as PostulanteListRow[]) : [];
	}

	static async damePostulante(id: string): Promise<PostulanteRow | null> {
		const [[postulante]] = await db.execute('CALL damePostulante(?)', [id]);
		return (postulante ?? null) as PostulanteRow | null;
	}

	static async dameEstadoPostulante(id: string): Promise<EstadoPostulante> {
		const [[row]] = await db.execute('CALL dameEstadoPostulante(?)', [id]);

		const estado = row?.estado;
		return estado as EstadoPostulante;
	}

	static async altaPostulante(data: AltaPostulanteData): Promise<string> {
		const [[resultado]] = await db.execute('CALL altaPostulante(?, ?, ?, ?, ?, ?)', [
			data.id,
			data.nombres,
			data.apellidos,
			data.email,
			data.genero,
			data.fechaNacimiento,
		]);

		const mensaje = resultado?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}

	static async modificaPostulante(data: ModificaPostulanteData): Promise<string> {
		const {
			id,
			nombres = null,
			apellidos = null,
			cuil = null,
			genero = null,
			localidad = null,
			telefono = null,
			habilidades = null,
		} = data;

		const habilidadesJson = habilidades == null ? null : JSON.stringify(habilidades);

		const [[resultado]] = await db.execute('CALL modificaPostulante(?, ?, ?, ?, ?, ?, ?, ?)', [
			id,
			nombres,
			apellidos,
			cuil,
			genero,
			localidad,
			telefono,
			habilidadesJson,
		]);

		const mensaje = resultado?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}

	static async activarPostulante(id: string): Promise<string> {
		const [[resultado]] = await db.execute('CALL activarPostulante(?)', [id]);

		const mensaje = resultado?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}

	static async inactivarPostulante(id: string): Promise<string> {
		const [[resultado]] = await db.execute('CALL inactivarPostulante(?)', [id]);

		const mensaje = resultado?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}

	static async reactivarPostulante(id: string): Promise<string> {
		const [[resultado]] = await db.execute('CALL reactivarPostulante(?)', [id]);

		const mensaje = resultado?.mensaje;
		return typeof mensaje === 'string' && mensaje.trim() ? mensaje : 'OK';
	}
}
