import { DataModel, DataSource } from '@toolpad/core/Crud';
import { fetchJson } from './utils';
import { getApiBase } from '../App';
import { CategoriaSchema } from '../schemas/categoriaSchema';

export type Estado = 'A' | 'I';

export interface Categoria extends DataModel {
	id: number;
	categoria: string;
	orden: number;
	estado: Estado;
}

interface StandardSchema {
	'~standard': {
		validate: (input: unknown) => unknown;
	};
}

function getCategoriasApiBase() {
	const apiBase = getApiBase();
	return `${apiBase}/admin/categorias`;
}

export async function patchEstadoCategoria(idCategoria: number, estado: Estado) {
	const API_BASE = getCategoriasApiBase();
	return fetchJson(`${API_BASE}/${encodeURIComponent(String(idCategoria))}/estado`, {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ estado }),
	});
}

export const categoriasDataSource: DataSource<Categoria> = {
	fields: [
		{ field: 'orden', headerName: 'Orden', type: 'number', width: 110 },
		{ field: 'id', headerName: 'ID', type: 'number', width: 90 },
		{ field: 'categoria', headerName: 'Categoría', width: 220 },
	],

	validate: (CategoriaSchema as unknown as StandardSchema)['~standard'].validate,

	async getMany() {
		const API_BASE = getCategoriasApiBase();
		const data = await fetchJson(`${API_BASE}`);
		return { items: data, itemCount: data.length };
	},

	async getOne(id) {
		const API_BASE = getCategoriasApiBase();
		return fetchJson(`${API_BASE}/${encodeURIComponent(String(id))}`);
	},

	async createOne(values) {
		const API_BASE = getCategoriasApiBase();
		const payload = { ...values } as Partial<Categoria>;
		delete payload.id;
		delete payload.estado;

		return fetchJson(API_BASE, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
	},

	async updateOne(id, values) {
		const API_BASE = getCategoriasApiBase();

		const payload = { ...values } as Partial<Categoria>;
		delete payload.id;
		delete payload.estado;

		return fetchJson(`${API_BASE}/${encodeURIComponent(String(id))}`, {
			method: 'PUT',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(payload),
		});
	},

	async deleteOne(id) {
		const API_BASE = getCategoriasApiBase();

		return fetchJson(`${API_BASE}/${encodeURIComponent(String(id))}`, {
			method: 'DELETE',
			headers: { Accept: 'application/json' },
		});
	},
};
