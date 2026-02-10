import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import { useParams } from 'react-router';
import SmartPageContainer from './SmartPageContainer';

import {
	DataGrid,
	type DataGridProps,
	useGridApiRef,
	type GridColDef,
	type GridRenderCellParams,
} from '@mui/x-data-grid';

import Switch from '@mui/material/Switch';
import Tooltip from '@mui/material/Tooltip';

import { useDialogs } from '@toolpad/core/useDialogs';

import { empresaDataSource, type Empresa, setEstadoEmpresa } from '../data/empresas';

type P = Record<string, string>;

export const empresasRouteSpecs = [
	{
		path: '/empresas',
		title: 'Todas las empresas',
		breadcrumbs: [{ title: 'empresas', path: (p: P) => `/${p.empresa}/empresas` }],
	},
	{
		path: '/empresas/new',
		title: 'Nueva empresa',
		breadcrumbs: [
			{ title: 'empresas', path: (p: P) => `/${p.empresa}/empresas` },
			{ title: 'nueva empresa' },
		],
	},
	{
		path: '/empresas/:id/edit/',
		title: 'Editar empresa',
		breadcrumbs: [
			{ title: 'empresas', path: (p: P) => `/${p.empresa}/empresas` },
			{ title: 'editar empresa' },
		],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={empresasRouteSpecs} />;
}

function EmpresasDataGrid(props: DataGridProps) {
	const dialogs = useDialogs();
	const apiRef = useGridApiRef();

	const pendingIdsRef = React.useRef<Set<number>>(new Set());
	const [, forceRender] = React.useState(0);
	const setPending = (id: number, val: boolean) => {
		const set = pendingIdsRef.current;
		if (val) set.add(id);
		else set.delete(id);
		forceRender((x) => x + 1);
	};

	const columns = React.useMemo(() => {
		const baseCols = props.columns ?? [];

		const switchCol: GridColDef = {
			field: 'activoSwitch',
			headerName: 'Activada',
			width: 110,
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params: GridRenderCellParams<Empresa>) => {
				const row = params.row;
				const id = Number(row.id);
				const isActiva = row.estado === 'A';
				const disabled = pendingIdsRef.current.has(id);

				return (
					<Tooltip title={isActiva ? 'Inactivar' : 'Activar'}>
						<Switch
							checked={isActiva}
							disabled={disabled}
							onClick={(e) => e.stopPropagation()}
							onChange={async (e) => {
								e.stopPropagation();

								const nextEstado: 'A' | 'I' = isActiva ? 'I' : 'A';
								const accion = isActiva ? 'Inactivar' : 'Activar';
								const accionLower = isActiva ? 'inactivar' : 'activar';

								const confirmed = await dialogs.confirm(
									`¿Seguro que querés ${accionLower} la empresa "${row.empresa}"?`,
									{
										okText: accion,
										cancelText: 'Cancelar',
										severity: isActiva ? 'error' : 'success',
									},
								);

								if (!confirmed) return;

								try {
									setPending(id, true);
									await setEstadoEmpresa(id, nextEstado);

									apiRef.current?.updateRows?.([{ id, estado: nextEstado }]);
								} catch (err: unknown) {
									const message =
										err instanceof Error ? err.message : 'No se pudo cambiar el estado.';
									await dialogs.alert(message, {
										title: 'Error',
									});
								} finally {
									setPending(id, false);
								}
							}}
						/>
					</Tooltip>
				);
			},
		};

		const idxEstado = baseCols.findIndex((c: GridColDef) => c?.field === 'estado');
		if (idxEstado >= 0) {
			return [...baseCols.slice(0, idxEstado + 1), switchCol, ...baseCols.slice(idxEstado + 1)];
		}

		const idxActions = baseCols.findIndex((c: GridColDef) => c?.type === 'actions');
		if (idxActions >= 0) {
			return [...baseCols.slice(0, idxActions), switchCol, ...baseCols.slice(idxActions)];
		}

		return [...baseCols, switchCol];
	}, [props.columns, dialogs, apiRef]);

	return <DataGrid {...props} apiRef={apiRef} columns={columns} />;
}

export default function EmpresaCrud() {
	const { empresa } = useParams();
	const rootPath = empresa ? `/${empresa}/empresas` : '/empresas';

	return (
		<Crud<Empresa>
			dataSource={empresaDataSource}
			rootPath={rootPath}
			initialPageSize={25}
			defaultValues={{ estado: 'A' }}
			slots={{
				pageContainer: PageWrapper,
				list: { dataGrid: EmpresasDataGrid },
			}}
		/>
	);
}
