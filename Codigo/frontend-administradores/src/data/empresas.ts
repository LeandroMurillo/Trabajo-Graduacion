import { DataModel, DataSource } from '@toolpad/core/Crud';
import { fetchJson } from './utils';
import { EmpresaSchema } from '../schemas/empresaSchema';

export type Estado = 'A' | 'I';

export interface Empresa extends DataModel {
	id: number;
	empresa: string;
	url: string;
	estado: Estado;
}

const API_ROOT = import.meta.env.VITE_API_URL as string;
const API_BASE = `${API_ROOT}/superadmin/empresas`;

export async function setEstadoEmpresa(id: number, estado: Estado) {
	return fetchJson(`${API_BASE}/${id}/estado`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ estado }),
	});
}

interface StandardSchema {
	'~standard': {
		validate: (input: unknown) => unknown;
	};
}

export const empresaDataSource: DataSource<Empresa> = {
	fields: [
		{ field: 'id', headerName: 'ID', type: 'number', width: 90 },
		{ field: 'empresa', headerName: 'Empresa', width: 220 },
		{ field: 'url', headerName: 'Slug del Sitio Web', width: 220 },
	],

	validate: (EmpresaSchema as unknown as StandardSchema)['~standard'].validate,

	async getMany() {
		const data = (await fetchJson(`${API_BASE}`)) as Empresa[];
		return { items: data, itemCount: data.length };
	},

	async getOne(id) {
		return fetchJson(`${API_BASE}/${id}`) as Promise<Empresa>;
	},

	async createOne(values) {
		return fetchJson(API_BASE, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		}) as Promise<Empresa>;
	},

	async updateOne(id, values) {
		return fetchJson(`${API_BASE}/${id}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(values),
		}) as Promise<Empresa>;
	},
	async deleteOne(id) {
		await fetchJson(`${API_BASE}/${id}`, {
			method: 'DELETE',
		});
	},
};
