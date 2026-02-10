import { DataModel, DataSource } from '@toolpad/core/Crud';

export interface Postulante extends DataModel {
	id: string;
	nombres: string;
	apellidos: string;
	email: string;
	cuil: string;
	genero: 'Masculino' | 'Femenino' | 'Otro';
	edad: number;
	localidad: string;
	telefono: string;
	observaciones: string;
	habilidades: string[];
	estado: 'P' | 'A' | 'I';
}

export const PostulantesDataSource: DataSource<Postulante> = {
	fields: [
		{ field: 'id', headerName: 'ID', width: 80 },
		{ field: 'nombres', headerName: 'Nombres', width: 150 },
		{ field: 'apellidos', headerName: 'Apellidos', width: 150 },
		{ field: 'email', headerName: 'Email', width: 200 },
		{ field: 'cuil', headerName: 'CUIL', width: 120 },
		{
			field: 'genero',
			headerName: 'Género',
			type: 'singleSelect',
			valueOptions: [
				{ value: 'M', label: 'Masculino' },
				{ value: 'F', label: 'Femenino' },
				{ value: 'X', label: 'Prefiero no decirlo' },
			],
			width: 120,
		},
		{ field: 'edad', headerName: 'Edad', type: 'number', width: 80 },
		{ field: 'localidad', headerName: 'Localidad', width: 150 },
		{ field: 'telefono', headerName: 'Teléfono', width: 130 },
		{
			field: 'habilidades',
			headerName: 'Habilidades',
			valueFormatter: (value: unknown) => {
				if (Array.isArray(value)) return value.map(String).join(', ');
				if (typeof value === 'string') {
					try {
						const parsed = JSON.parse(value);
						if (Array.isArray(parsed)) return parsed.map(String).join(', ');
					} catch {
						return value
							.split(',')
							.map((s) => s.trim())
							.filter(Boolean)
							.join(', ');
					}
					return value;
				}
				return value == null ? '' : String(value);
			},
		},
		{
			field: 'estado',
			headerName: 'Estado',
			type: 'singleSelect',
			valueOptions: [
				{ value: 'P', label: 'Pendiente' },
				{ value: 'A', label: 'Activo' },
				{ value: 'I', label: 'Inactivo' },
			],
			width: 100,
		},
	],
};
