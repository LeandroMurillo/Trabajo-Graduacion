import type { DataModel, DataSource } from '@toolpad/core/Crud';
import { toDate } from './utils';
import { vacanteSchema } from '../schemas/vacanteSchema';

export type TipoTrabajo =
	| 'Sin Especificar'
	| 'Tiempo Completo'
	| 'Medio Tiempo'
	| 'Remoto'
	| 'Híbrido';
export type Modalidad = 'Sin Especificar' | 'Presencial' | 'Remoto' | 'Híbrido';
export type NivelExperiencia = 'Sin Especificar' | 'Junior' | 'SemiSenior' | 'Senior';
export type EstadoVacante = 'B' | 'P' | 'C';

interface StandardSchema {
	'~standard': { validate: (input: unknown) => unknown };
}

export interface Vacante extends DataModel {
	id: number;
	categoria: string;
	vacante: string;
	descripcion: string | null;
	tipoTrabajo: TipoTrabajo;
	modalidad: Modalidad;
	fechaCreacion: string;
	fechaPublicacion: string | null;
	fechaCierre: string | null;
	localidad: string | null;
	nivelExperiencia: NivelExperiencia;
	habilidades: string | string[];
	estado: EstadoVacante;
}

export const vacantesDataSource: DataSource<Vacante> = {
	fields: [
		{ field: 'id', headerName: 'ID', width: 60 },
		{ field: 'categoria', headerName: 'Categoría' },
		{ field: 'vacante', headerName: 'Título', width: 240 },
		{ field: 'descripcion', headerName: 'Descripción', flex: 1 },
		{
			field: 'tipoTrabajo',
			headerName: 'Tipo de trabajo',
			type: 'singleSelect',
			valueOptions: ['Sin Especificar', 'Tiempo Completo', 'Medio Tiempo', 'Contrato'],
		},
		{
			field: 'modalidad',
			headerName: 'Modalidad',
			type: 'singleSelect',
			valueOptions: ['Sin Especificar', 'Presencial', 'Remoto', 'Híbrido'],
		},
		{
			field: 'nivelExperiencia',
			headerName: 'Experiencia',
			type: 'singleSelect',
			valueOptions: ['Sin Especificar', 'Junior', 'SemiSenior', 'Senior'],
		},
		{ field: 'localidad', headerName: 'Localidad', width: 180 },
		{
			field: 'habilidades',
			headerName: 'Habilidades',
			valueFormatter: (value: unknown) => {
				if (typeof value === 'string') return value;
				if (Array.isArray(value)) return value.map(String).join(', ');
				return value == null ? '' : String(value);
			},
		},
		{
			field: 'fechaCreacion',
			headerName: 'Creación',
			type: 'dateTime',
			valueGetter: (v) => toDate(v),
			width: 160,
			editable: false,
		},
		{
			field: 'fechaPublicacion',
			headerName: 'Publicación',
			type: 'dateTime',
			valueGetter: (v) => toDate(v),
			width: 160,
			editable: false,
		},
		{
			field: 'fechaCierre',
			headerName: 'Cierre',
			type: 'dateTime',
			valueGetter: (v) => toDate(v),
			width: 160,
			editable: false,
		},
		{
			field: 'estado',
			headerName: 'Estado',
			type: 'singleSelect',
			valueOptions: [
				{ value: 'B', label: 'Borrador' },
				{ value: 'P', label: 'Publicada' },
				{ value: 'C', label: 'Cerrada' },
			],
			width: 90,
			editable: false,
		},
	],

	validate: (vacanteSchema as unknown as StandardSchema)['~standard'].validate,
};
