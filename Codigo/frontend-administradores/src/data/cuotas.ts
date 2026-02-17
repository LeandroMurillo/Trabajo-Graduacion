import type { DataModel, DataSource } from '@toolpad/core/Crud';
import type {
	GridFilterModel,
	GridFilterOperator,
	GridPaginationModel,
	GridSortModel,
} from '@mui/x-data-grid';
import { getGridStringOperators } from '@mui/x-data-grid';
import { fetchJson } from './utils';

export interface Cuota extends DataModel {
	id: number;
	empresa: string;
	url: string;
	monto: number;
	fechaPago: string;
}

type GetManyParams = {
	paginationModel: GridPaginationModel;
	sortModel: GridSortModel;
	filterModel: GridFilterModel;
};

type CuotasDataSource = DataSource<Cuota> & Required<Pick<DataSource<Cuota>, 'getMany'>>;

const API_ROOT = import.meta.env.VITE_API_URL as string;
const API_BASE = `${API_ROOT}/superadmin/cuotas`;

const onlyContains: GridFilterOperator[] = getGridStringOperators().filter(
	(op) => op.value === 'contains',
);

interface CuotaRaw {
	id?: number;
	empresa?: string;
	url?: string;
	monto?: number;
	fechaPago?: string;
}

function mapCuota(row: CuotaRaw): Cuota {
	return {
		id: Number(row.id),
		empresa: String(row.empresa ?? ''),
		url: String(row.url ?? ''),
		monto: typeof row.monto === 'string' ? Number(row.monto) : Number(row.monto ?? 0),
		fechaPago: String(row.fechaPago ?? ''),
	};
}

export const cuotasDataSource: CuotasDataSource = {
	fields: [
		{ field: 'id', headerName: 'ID', type: 'number', width: 90, filterable: false },
		{
			field: 'empresa',
			headerName: 'Empresa',
			width: 220,
			filterable: true,
			filterOperators: onlyContains,
		},
		{ field: 'url', headerName: 'Slug', width: 180, filterable: false },
		{ field: 'monto', headerName: 'Monto', type: 'number', width: 140, filterable: false },
		{
			field: 'fechaPago',
			headerName: 'Fecha de pago',
			type: 'date',
			width: 160,
			valueGetter: (value: string | number | Date | null) => (value ? new Date(value) : null),
			filterable: false,
		},
	],

	async getMany({ paginationModel, sortModel, filterModel }: GetManyParams) {
		const page = paginationModel.page ?? 0;
		const pageSize = paginationModel.pageSize ?? 25;

		const url = new URL(API_BASE);
		url.searchParams.set('page', String(page));
		url.searchParams.set('pageSize', String(pageSize));
		url.searchParams.set('sort', sortModel?.length ? JSON.stringify(sortModel) : '[]');

		const filterItems = filterModel?.items ?? [];
		url.searchParams.set('filter', filterItems.length ? JSON.stringify(filterItems) : '[]');

		const res = await fetchJson(url.toString());

		const rawItems = Array.isArray(res?.items) ? res.items : [];
		const itemCount = Number(res?.itemCount ?? 0);

		return {
			items: rawItems.map(mapCuota),
			itemCount,
		};
	},
};
