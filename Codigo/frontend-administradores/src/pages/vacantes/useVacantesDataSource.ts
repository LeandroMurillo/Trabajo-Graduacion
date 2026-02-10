import * as React from 'react';
import type { DataSource, DataModelId } from '@toolpad/core/Crud';
import { vacantesDataSource, type Vacante } from '../../data/vacantes';
import { fetchJson, fromSlug, habilidadesCsvToJson } from '../../data/utils';
import { getApiBase } from '../../App';

import type { GridPaginationModel, GridSortModel } from '@mui/x-data-grid';

export type DSWithMutations = DataSource<Vacante> &
	Required<
		Pick<DataSource<Vacante>, 'getMany' | 'createOne' | 'updateOne' | 'getOne' | 'deleteOne'>
	>;

type Params = {
	isCategoriaView: boolean;
	slug?: string;
};

function normalizeVacantePayload(input: Partial<Vacante>) {
	return {
		...input,

		// DB: Vacantes.descripcion es TEXT NOT NULL => no mandes undefined
		descripcion: input.descripcion ?? '',

		// DB: nivelExperiencia enum NO tiene "Sin Especificar" y permite NULL
		nivelExperiencia: input.nivelExperiencia === 'Sin Especificar' ? null : input.nivelExperiencia,

		// CSV/string[] => JSON array (tu helper debería soportar ambos o al menos string)
		habilidades: habilidadesCsvToJson((input as Record<string, unknown>)?.habilidades),
	};
}

export function useVacantesDataSource({ isCategoriaView, slug }: Params): DSWithMutations {
	const [categoriaOptions, setCategoriaOptions] = React.useState<string[]>([]);
	const API = getApiBase();

	React.useEffect(
		function cargarCategorias() {
			let mounted = true;

			fetchJson(`${API}/admin/categorias?estado=A`)
				.then((rows: Array<{ categoria: string }>) => {
					if (!mounted) return;
					setCategoriaOptions(rows.map((r) => r.categoria).filter(Boolean));
				})
				.catch(() => setCategoriaOptions([]));

			return () => {
				mounted = false;
			};
		},
		[API],
	);

	return React.useMemo<DSWithMutations>(
		function build() {
			const fields = vacantesDataSource.fields.map((f) =>
				f.field === 'categoria'
					? { ...f, type: 'singleSelect' as const, valueOptions: categoriaOptions }
					: f,
			);

			async function getMany({
				paginationModel,
				sortModel,
			}: {
				paginationModel: GridPaginationModel;
				sortModel: GridSortModel;
			}) {
				const params = new URLSearchParams();

				if (isCategoriaView && slug) {
					params.set('categoria', fromSlug(slug, 'lower'));
				}

				params.set('page', String(paginationModel.page));
				params.set('pageSize', String(paginationModel.pageSize));

				const first = sortModel?.[0];
				const sortField = first?.field ? String(first.field) : 'fechaCreacion';
				const sortDir = first?.sort === 'asc' ? 'asc' : 'desc';

				params.set('sortField', sortField);
				params.set('sortDir', sortDir);

				const url = `${API}/admin/vacantes?${params.toString()}`;
				const res: { items: Vacante[]; itemCount: number } = await fetchJson(url);

				return res;
			}

			async function getOne(id: DataModelId): Promise<Vacante> {
				const idStr = String(id);
				return fetchJson(`${API}/admin/vacantes/${encodeURIComponent(idStr)}`);
			}

			async function createOne(values: Partial<Vacante>): Promise<Vacante> {
				const payload = normalizeVacantePayload(values);

				return fetchJson(`${API}/admin/vacantes`, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});
			}

			async function updateOne(
				id: DataModelId,
				data: Partial<Omit<Vacante, 'id'>>,
			): Promise<Vacante> {
				const idStr = String(id);

				const payload = normalizeVacantePayload(data as Partial<Vacante>);

				const res = await fetchJson(`${API}/admin/vacantes/${encodeURIComponent(idStr)}`, {
					method: 'PUT',
					credentials: 'include',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify(payload),
				});

				return (res?.vacante ?? res) as Vacante;
			}

			async function deleteOne(id: DataModelId): Promise<void> {
				const idStr = String(id);

				await fetchJson(`${API}/admin/vacantes/${encodeURIComponent(idStr)}`, {
					method: 'DELETE',
					credentials: 'include',
				});
			}

			return {
				...vacantesDataSource,
				fields,
				getMany,
				getOne,
				createOne,
				updateOne,
				deleteOne,
			};
		},
		[API, isCategoriaView, slug, categoriaOptions],
	);
}
