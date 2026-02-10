import * as React from 'react';
import type { DataModel, DataSource } from '@toolpad/core/Crud';
import { TextField } from '@mui/material';
import type { GridRenderEditCellParams } from '@mui/x-data-grid';
import { fetchJson } from './utils';
import { AdministradorSchema } from '../schemas/administradorSchema';

export type Rol = 'ADMIN';

export interface Administrador extends DataModel {
	id: number;
	email: string;
	empresa: string;
	rol: Rol;
	clave?: string;
	confirmarClave?: string;
}

export type EmpresaOption = {
	value: string;
	label: string;
};

const API_BASE = `${import.meta.env.VITE_API_URL}/superadmin/administradores`;

type StandardSchema = {
	'~standard': {
		validate: (value: unknown) => unknown;
	};
};

function normalizeString(v: unknown) {
	return String(v ?? '').trim();
}

function PasswordEditCell(params: GridRenderEditCellParams) {
	return (
		<TextField
			fullWidth
			size='small'
			type='password'
			value={params.value ?? ''}
			autoComplete='new-password'
			onChange={(e) => {
				params.api.setEditCellValue({
					id: params.id,
					field: params.field,
					value: e.target.value,
				});
			}}
		/>
	);
}

export function createAdministradorDataSource(
	empresaOptions: EmpresaOption[],
): DataSource<Administrador> {
	return {
		fields: [
			{ field: 'id', headerName: 'ID', type: 'number', width: 90 },

			{ field: 'email', headerName: 'Correo', width: 260 },

			{
				field: 'empresa',
				headerName: 'Empresa',
				type: 'singleSelect',
				width: 260,
				valueOptions: empresaOptions,
			},

			{
				field: 'clave',
				headerName: 'Contraseña',
				width: 260,
				renderEditCell: PasswordEditCell,
			},

			{
				field: 'confirmarClave',
				headerName: 'Confirmar contraseña',
				width: 260,
				renderEditCell: PasswordEditCell,
			},

			{
				field: 'rol',
				headerName: 'Rol',
				width: 180,
				editable: false,
			},
		],

		validate: (AdministradorSchema as unknown as StandardSchema)['~standard'].validate,

		async getMany() {
			const data = await fetchJson(`${API_BASE}`);
			return { items: data, itemCount: data.length };
		},

		async getOne(id) {
			return fetchJson(`${API_BASE}/${id}`);
		},

		async createOne(values) {
			const parsed = AdministradorSchema.parse(values);

			const clave = normalizeString(parsed.clave);
			const confirmarClave = normalizeString(parsed.confirmarClave);

			if (!clave || !confirmarClave) {
				throw new Error('Debe ingresar y confirmar una contraseña provisional.');
			}

			const payload = {
				email: parsed.email,
				empresa: parsed.empresa,
				clave,
			};

			return fetchJson(API_BASE, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
		},

		async updateOne(id, values) {
			const parsed = AdministradorSchema.parse(values);

			const email = String(parsed.email ?? '').trim();
			const empresa = String(parsed.empresa ?? '').trim();

			const claveIngresada = String(parsed.clave ?? '').trim();
			const confirmarIngresada = String(parsed.confirmarClave ?? '').trim();

			const payload: Partial<Pick<Administrador, 'email' | 'empresa' | 'clave'>> = {};

			// Siempre mandamos email/empresa (porque tu schema los exige)
			// Si querés mandar solo cambios, eso ya sería otro paso.
			payload.email = email;
			payload.empresa = empresa;

			// Clave solo si se tocó
			if (!claveIngresada && !confirmarIngresada) {
				// no se envía
			} else {
				payload.clave = claveIngresada;
			}

			return fetchJson(`${API_BASE}/${id}`, {
				method: 'PUT',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(payload),
			});
		},

		async deleteOne(id) {
			await fetchJson(`${API_BASE}/${id}`, { method: 'DELETE' });
		},
	};
}
