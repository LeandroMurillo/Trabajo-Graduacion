// data/postulantes.ts
import type { DataModel, DataSource } from '@toolpad/core/Crud';

export interface Postulante extends DataModel {
	id: string;
	nombres: string;
	apellidos: string;
	email: string;
	cuil: string;
	genero: 'M' | 'F' | 'X';
	fechaNacimiento: string;
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
		{
			field: 'fechaNacimiento',
			headerName: 'Fecha De Nacimiento',
			type: 'date',
			width: 155,
			valueGetter: (value: unknown) => {
				if (value == null) return null;
				const ymd = String(value).slice(0, 10);
				const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(ymd);
				if (!m) return null;
				const y = Number(m[1]);
				const mo = Number(m[2]);
				const d = Number(m[3]);
				return new Date(Date.UTC(y, mo - 1, d));
			},
			valueFormatter: (value: unknown) =>
				value instanceof Date
					? value.toLocaleDateString('es-AR', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
							timeZone: 'UTC',
						})
					: '',
		},
		{ field: 'localidad', headerName: 'Localidad', width: 150 },
		{ field: 'telefono', headerName: 'Teléfono', width: 130 },
		{
			field: 'habilidades',
			headerName: 'Habilidades',
			valueFormatter: (value: unknown) => {
				if (Array.isArray(value)) return value.map(String).join(', ');
				if (typeof value === 'string') {
					try {
						const parsed: unknown = JSON.parse(value);
						if (Array.isArray(parsed)) return parsed.map(String).join(', ');
					} catch {
						// ignore
					}

					return value
						.split(',')
						.map((s) => s.trim())
						.filter(Boolean)
						.join(', ');
				}

				return value == null ? '' : String(value);
			},
			width: 250,
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
