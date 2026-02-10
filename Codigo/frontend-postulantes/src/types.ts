export interface EstiloData {
	cssVariables: boolean;
	palette: {
		primary: { main: string };
		secondary: { main: string };
		error: { main: string };
	};
}

export type FiltroVacantes = {
	titulo?: string | null;
	categoria?: string | null;
	offset?: number;
	limit?: number;
};

export type DameVacantesResult = {
	items: Vacante[];
	itemCount: number;
};

export type TipoTrabajo =
	| 'Sin Especificar'
	| 'Tiempo Completo'
	| 'Medio Tiempo'
	| 'Remoto'
	| 'Híbrido';

export type Modalidad = 'Sin Especificar' | 'Presencial' | 'Remoto' | 'Híbrido';

export type NivelExperiencia = 'Junior' | 'SemiSenior' | 'Senior';

export interface Vacante {
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

export interface Categoria {
	idCategoria: number;
	categoria: string;
}

export interface AltaPostulanteData {
	nombres: string;
	apellidos: string;
	email: string;
	contraseña: string;
	fechaNacimiento: string; // formato: DD-MM-AAAA
	genero: string; // M, F, X
}

export interface Postulante {
	nombres: string;
	apellidos: string;
	email: string;
	cuil: string;
	genero: string; // M, F, X
	fechaNacimiento: string; // formato: DD-MM-AAAA
	localidad: string;
	telefono: string;
	habilidades: string[];
}

export interface RegisterResponse {
	message: string;
}

export interface LoginResponse {
	usuario: {
		idAdministrador: number;
		email: string;
		rol: 'ADMIN' | 'SUPERADMIN';
		empresaSlug?: string;
		nombre?: string;
	};
}

export interface Curriculum {
	id: string;
	nombre: string;
}

export interface CurriculumHeadResult {
	status: number;
	filename?: string;
	url: string;
}

export interface Postulacion {
	id: number;
	idVacante: number;
	titulo: string;
	categoria: string;
	fecha: string;
	estado: string;
}

export interface RestablecerClaveResponse {
	message: string;
}
