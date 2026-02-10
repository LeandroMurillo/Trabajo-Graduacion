import type { DataModel, DataSource } from '@toolpad/core/Crud';
import type { GridFilterModel, GridPaginationModel, GridSortModel } from '@mui/x-data-grid';
import { fetchJson } from './utils';

export interface Cuota extends DataModel {
	id: string;
	idCuota: number;
	idEmpresa: number;
	empresa: string;
	monto: string;
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

interface CuotaRaw {
	idEmpresa?: number | string;
	idCuota?: number | string;
	empresa?: string;
	monto?: string;
	fechaPago?: string;
}

function mapCuota(row: CuotaRaw): Cuota {
	const idEmpresa = Number(row.idEmpresa);
	const idCuota = Number(row.idCuota);

	return {
		id: `${idEmpresa}-${idCuota}`,
		idCuota,
		idEmpresa,
		empresa: String(row.empresa ?? ''),
		monto: String(row.monto ?? ''),
		fechaPago: String(row.fechaPago ?? ''),
	};
}

export const cuotasDataSource: CuotasDataSource = {
	fields: [
		{ field: 'idCuota', headerName: 'ID', type: 'number', width: 90 },
		{ field: 'empresa', headerName: 'Empresa', width: 220 },
		{ field: 'monto', headerName: 'Monto', width: 140 },
		{
			field: 'fechaPago',
			headerName: 'Fecha de pago',
			type: 'date',
			width: 160,
			valueGetter: (value: string | number | Date | null) => (value ? new Date(value) : null),
		},
	],

	async getMany(params: GetManyParams) {
		const page = params.paginationModel.page ?? 0;
		const pageSize = params.paginationModel.pageSize ?? 25;

		const sortField = params.sortModel?.[0]?.field ?? null;
		const sortDir = params.sortModel?.[0]?.sort ?? null;

		const url = new URL(API_BASE);
		url.searchParams.set('page', String(page + 1));
		url.searchParams.set('pageSize', String(pageSize));

		if (sortField && sortDir) {
			const normalizedSortField = sortField === 'id' ? 'idCuota' : sortField;
			url.searchParams.set('sortBy', normalizedSortField);
			url.searchParams.set('sortDir', sortDir);
		}

		const res = await fetchJson(url.toString());

		const rawItems = Array.isArray(res?.items)
			? res.items
			: Array.isArray(res?.data)
				? res.data
				: Array.isArray(res)
					? res
					: [];

		const itemCount = Number(res?.itemCount ?? res?.total ?? rawItems.length);

		return {
			items: rawItems.map(mapCuota),
			itemCount,
		};
	},
};
