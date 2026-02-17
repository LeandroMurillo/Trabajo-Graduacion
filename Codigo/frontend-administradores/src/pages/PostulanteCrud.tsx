// PostulanteCrud.tsx (o PostulanteList.tsx)
import * as React from 'react';
import { List } from '@toolpad/core/Crud';
import { useNavigate, useParams } from 'react-router';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import SmartPageContainer from './SmartPageContainer';

import { PostulantesDataSource, type Postulante } from '../data/postulantes';
import { fetchJson } from '../data/utils';
import { getApiBase } from '../App';

import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogActions from '@mui/material/DialogActions';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function toSlug(value: string) {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/,/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-');
}

type P = Record<string, string>;

const routeSpecs = [
	{
		path: '/postulantes',
		title: 'Todos los postulantes',
		breadcrumbs: [{ title: 'postulantes', path: (p: P) => `/${p.empresa}/postulantes` }],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={routeSpecs} />;
}

function getPostulantesApiBase() {
	const apiBase = getApiBase();
	return `${apiBase}/admin/postulantes`;
}

function normalizeHabilidades(value: unknown): string[] {
	if (Array.isArray(value)) return value.map(String);

	if (typeof value === 'string') {
		try {
			const parsed: unknown = JSON.parse(value);
			if (Array.isArray(parsed)) return parsed.map(String);
		} catch {
			// ignore
		}
	}

	return [];
}

type PostulanteApi = Omit<Postulante, 'habilidades'> & { habilidades?: unknown };

function normalizePostulante(p: PostulanteApi): Postulante {
	return {
		...p,
		habilidades: normalizeHabilidades(p.habilidades),
	} as Postulante;
}

type ConfirmState = { open: false } | { open: true; row: Postulante; action: 'baja' | 'reactivar' };

function getErrorMessage(err: unknown): string {
	if (err instanceof Error) return err.message;

	if (typeof err === 'object' && err !== null) {
		const maybe = err as Record<string, unknown>;
		if (typeof maybe.message === 'string') return maybe.message;
		if (typeof maybe.error === 'string') return maybe.error;
	}

	return 'No se pudo actualizar el estado del postulante.';
}

export default function PostulanteList() {
	const navigate = useNavigate();
	const { empresa } = useParams();

	const [confirm, setConfirm] = React.useState<ConfirmState>({ open: false });
	const [loading, setLoading] = React.useState(false);
	const [errorMsg, setErrorMsg] = React.useState('');

	// ✅ esto reemplaza apiRef.refreshRows/forceUpdate
	const [reloadKey, setReloadKey] = React.useState(0);

	async function ejecutarAccion() {
		if (!confirm.open) return;

		setLoading(true);
		setErrorMsg('');

		const { row, action } = confirm;
		const API_BASE = getPostulantesApiBase();

		const estado = action === 'baja' ? 'I' : 'A';

		try {
			await fetchJson(`${API_BASE}/${encodeURIComponent(row.id)}/estado`, {
				method: 'PATCH',
				body: JSON.stringify({ estado }),
			});

			setConfirm({ open: false });

			// fuerza a que List vuelva a pedir getMany()
			setReloadKey((k) => k + 1);
		} catch (err: unknown) {
			setErrorMsg(getErrorMessage(err));
		} finally {
			setLoading(false);
		}
	}

	const fields = React.useMemo<GridColDef[]>(() => {
		const base = PostulantesDataSource.fields as GridColDef[];

		const acciones: GridColDef = {
			field: 'acciones',
			headerName: 'Acciones',
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			width: 160,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params: GridRenderCellParams<Postulante>) => {
				const row = params.row;
				const isInactivo = row.estado === 'I';
				const label = isInactivo ? 'Reactivar' : 'Dar de baja';

				return (
					<Button
						variant='outlined'
						size='small'
						onClick={(e) => {
							e.stopPropagation();
							setErrorMsg('');
							setConfirm({
								open: true,
								row,
								action: isInactivo ? 'reactivar' : 'baja',
							});
						}}
					>
						{label}
					</Button>
				);
			},
		};

		return [...base, acciones];
	}, []);

	return (
		<>
			<List<Postulante>
				// ✅ al cambiar reloadKey, React remonta el componente List y re-ejecuta getMany
				key={reloadKey}
				dataSource={{
					...PostulantesDataSource,
					fields,
					async getMany() {
						const API_BASE = getPostulantesApiBase();
						const data = (await fetchJson(`${API_BASE}`)) as PostulanteApi[];
						const items = data.map(normalizePostulante);
						return { items, itemCount: items.length };
					},
				}}
				initialPageSize={25}
				slots={{ pageContainer: PageWrapper }}
				slotProps={{
					dataGrid: {
						pageSizeOptions: [25],
						columnVisibilityModel: { id: false },
						onRowClick: (params: { row: Postulante }) => {
							const row = params.row;
							if (!empresa) return;

							const displayName =
								row.apellidos && row.nombres ? `${row.apellidos}, ${row.nombres}` : String(row.id);

							const postulanteSlug = toSlug(displayName);
							navigate(`/${empresa}/postulantes/${row.id}/${postulanteSlug}/postulaciones`);
						},
					},
				}}
			/>

			<Dialog
				open={confirm.open}
				onClose={() => {
					if (loading) return;
					setConfirm({ open: false });
					setErrorMsg('');
				}}
				aria-labelledby='confirm-postulante-title'
			>
				<DialogTitle id='confirm-postulante-title'>
					{confirm.open
						? confirm.action === 'baja'
							? 'Confirmar baja'
							: 'Confirmar reactivación'
						: ''}
				</DialogTitle>

				<DialogContent>
					{confirm.open ? (
						<DialogContentText>
							{confirm.action === 'baja'
								? `Vas a dar de baja a ${confirm.row.apellidos}, ${confirm.row.nombres}.`
								: `Vas a reactivar a ${confirm.row.apellidos}, ${confirm.row.nombres}.`}
						</DialogContentText>
					) : null}

					{errorMsg ? (
						<Alert severity='error' sx={{ mt: 2 }}>
							{errorMsg}
						</Alert>
					) : null}
				</DialogContent>

				<DialogActions>
					<Button
						onClick={() => {
							setConfirm({ open: false });
							setErrorMsg('');
						}}
						disabled={loading}
					>
						Cancelar
					</Button>

					<Button onClick={ejecutarAccion} variant='contained' disabled={loading || !confirm.open}>
						{loading ? (
							<CircularProgress size={20} />
						) : confirm.open && confirm.action === 'baja' ? (
							'Dar de baja'
						) : (
							'Reactivar'
						)}
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
}
