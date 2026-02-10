import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import { useLocation, useNavigate } from 'react-router';

import SmartPageContainer from './SmartPageContainer';
import { type Categoria, categoriasDataSource, patchEstadoCategoria } from '.././data/categorias';
import { slugify, fromSlug } from '.././data/utils';

import Switch from '@mui/material/Switch';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import {
	type GridColDef,
	GridActionsCellItem,
	useGridApiRef,
	type GridApiCommon,
	type GridRenderCellParams,
	type GridRowParams,
	type GridEventListener,
	type GridRowClassNameParams,
	type GridRowModel,
} from '@mui/x-data-grid';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

type P = Record<string, string>;

export const categoriasRouteSpecs = [
	{
		path: '/categorias',
		title: 'Todas las categorías',
		breadcrumbs: [{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` }],
	},
	{
		path: '/categorias/new',
		title: 'Nueva categoría',
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			{ title: 'nueva categoría' },
		],
	},
	{
		path: '/categorias/:id/edit',
		title: 'Editar categoría',
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			{ title: 'editar categoría' },
		],
	},
	{
		path: '/categorias/:slug/vacantes',
		title: (params: Record<string, string>) => `Vacantes de ${fromSlug(params.slug, 'lower')}`,
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			{ title: (params: Record<string, string>) => fromSlug(params.slug, 'lower') },
		],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={categoriasRouteSpecs} />;
}

function computeRootPath(pathname: string) {
	return pathname.replace(/\/new$/, '').replace(/\/[^/]+\/edit$/, '');
}

export default function CategoriaCrud() {
	const navigate = useNavigate();
	const { pathname } = useLocation();

	const rootPath = React.useMemo(() => computeRootPath(pathname), [pathname]);

	const apiRef = useGridApiRef<GridApiCommon>();
	const [pending, setPending] = React.useState<Record<number, boolean>>({});

	// Dialog borrar
	const [deleteOpen, setDeleteOpen] = React.useState(false);
	const [deleteBusy, setDeleteBusy] = React.useState(false);
	const [deleteError, setDeleteError] = React.useState<string | null>(null);
	const [deleteTarget, setDeleteTarget] = React.useState<{ id: number; categoria: string } | null>(
		null,
	);

	const go = (path: string) => navigate(path);

	const safeUpdateRows = (updates: Partial<Categoria>[]) => {
		apiRef.current?.updateRows?.(updates);
	};

	const openDeleteDialog = (row: Categoria) => {
		setDeleteError(null);
		setDeleteTarget({ id: Number(row.id), categoria: row.categoria });
		setDeleteOpen(true);
	};

	const closeDeleteDialog = () => {
		if (deleteBusy) return;
		setDeleteOpen(false);
		setDeleteTarget(null);
		setDeleteError(null);
	};

	const confirmDelete = async () => {
		if (!deleteTarget) return;

		setDeleteBusy(true);
		setDeleteError(null);

		try {
			await categoriasDataSource.deleteOne?.(deleteTarget.id);

			apiRef.current?.updateRows?.([
				{ id: deleteTarget.id, _action: 'delete' } as unknown as GridRowModel,
			]);

			setDeleteOpen(false);
			setDeleteTarget(null);
		} catch (err: unknown) {
			const msg =
				err instanceof Error
					? err.message
					: typeof err === 'object' && err && 'message' in err
						? String((err as Record<string, unknown>).message)
						: 'No se pudo borrar la categoría.';
			setDeleteError(msg);
		} finally {
			setDeleteBusy(false);
		}
	};

	const columns = React.useMemo<GridColDef<Categoria>[]>(() => {
		return [
			{ field: 'orden', headerName: 'Orden', type: 'number', width: 110 },
			{ field: 'id', headerName: 'ID', type: 'number', width: 90 },
			{ field: 'categoria', headerName: 'Categoría', width: 220, flex: 1 },

			{
				field: 'activada',
				headerName: 'Activada',
				width: 120,
				sortable: false,
				filterable: false,
				disableColumnMenu: true,
				renderCell: (params: GridRenderCellParams<Categoria>) => {
					const id = Number(params.row.id);
					const checked = params.row.estado === 'A';
					const disabled = !!pending[id];

					return (
						<Switch
							size='small'
							checked={checked}
							disabled={disabled}
							onClick={(e) => e.stopPropagation()}
							onChange={async (e) => {
								e.stopPropagation();

								const nuevoEstado = e.target.checked ? 'A' : 'I';

								setPending((m) => ({ ...m, [id]: true }));
								try {
									await patchEstadoCategoria(id, nuevoEstado);
									safeUpdateRows([{ id, estado: nuevoEstado }]);
								} catch (err) {
									console.error('Error patchEstadoCategoria:', err);
								} finally {
									setPending((m) => ({ ...m, [id]: false }));
								}
							}}
						/>
					);
				},
			},

			{
				field: 'actions',
				type: 'actions',
				headerName: 'Acciones',
				width: 140,
				getActions: (params: GridRowParams<Categoria>) => {
					const id = Number(params.row.id);

					return [
						<GridActionsCellItem
							key='edit'
							icon={<EditIcon />}
							label='Editar'
							onClick={(e) => {
								e.stopPropagation();
								go(`${rootPath}/${id}/edit`);
							}}
							showInMenu={false}
						/>,
						<GridActionsCellItem
							key='delete'
							icon={<DeleteIcon />}
							label='Borrar'
							onClick={(e) => {
								e.stopPropagation();
								openDeleteDialog(params.row);
							}}
							showInMenu={false}
						/>,
					];
				},
			},
		];
	}, [pending, rootPath]); // intencional: handlers usan state setters estables

	const handleRowClick: GridEventListener<'rowClick'> = (params, event) => {
		const target = event?.target;

		if (target instanceof Element) {
			if (target.closest('button, a, [role="button"]')) return;
		}

		const slug = encodeURIComponent(slugify(params.row.categoria));
		go(`${rootPath}/${slug}/vacantes`);
	};

	return (
		<>
			<Crud<Categoria>
				dataSource={categoriasDataSource}
				rootPath={rootPath}
				initialPageSize={25}
				defaultValues={{ orden: 1 }}
				slots={{ pageContainer: PageWrapper }}
				slotProps={{
					list: {
						dataGrid: {
							apiRef,
							pageSizeOptions: [25],
							columns,
							columnVisibilityModel: { id: false },
							initialState: {
								pinnedColumns: { right: ['actions'] },
							},

							getRowClassName: (params: GridRowClassNameParams<Categoria>) =>
								params.row.estado === 'I' ? 'row-inactiva' : '',
							sx: {
								'& .row-inactiva': { opacity: 0.55, filter: 'grayscale(1)' },
								'& .row-inactiva .MuiDataGrid-cell': { color: 'text.disabled' },
							},

							onRowClick: handleRowClick,
						},
					},
				}}
			/>

			<Dialog open={deleteOpen} onClose={closeDeleteDialog} maxWidth='xs' fullWidth>
				<DialogTitle>Borrar categoría</DialogTitle>

				<DialogContent>
					<Typography variant='body2' sx={{ mb: 1 }}>
						¿Seguro que querés borrar la categoría <strong>{deleteTarget?.categoria ?? ''}</strong>?
					</Typography>

					<Typography variant='body2' color='text.secondary'>
						Solo se puede borrar si está inactiva y no tiene vacantes asociadas.
					</Typography>

					{deleteError ? (
						<Typography variant='body2' color='error' sx={{ mt: 2 }}>
							{deleteError}
						</Typography>
					) : null}
				</DialogContent>

				<DialogActions>
					<Button onClick={closeDeleteDialog} disabled={deleteBusy}>
						Cancelar
					</Button>
					<Button onClick={confirmDelete} disabled={deleteBusy} color='error' variant='contained'>
						Borrar
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
