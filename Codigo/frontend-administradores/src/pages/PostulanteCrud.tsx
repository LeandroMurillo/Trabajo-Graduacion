import * as React from 'react';
import { List } from '@toolpad/core/Crud';
import { useNavigate, useParams } from 'react-router';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import SmartPageContainer from './SmartPageContainer';

import { PostulantesDataSource, type Postulante } from '../data/postulantes';
import { fetchJson } from '../data/utils';
import { getApiBase } from '../App';

import type { GridColDef, GridRenderCellParams } from '@mui/x-data-grid';

import Alert from '@mui/material/Alert';
import Switch from '@mui/material/Switch';
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

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
	return `${getApiBase()}/admin/postulantes`;
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
	return { ...p, habilidades: normalizeHabilidades(p.habilidades) } as Postulante;
}

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

	const [loadingId, setLoadingId] = React.useState<string | null>(null);
	const [errorMsg, setErrorMsg] = React.useState('');
	const [estadoOverride, setEstadoOverride] = React.useState<Record<string, 'A' | 'I'>>({});

	const loadingIdRef = React.useRef<string | null>(null);
	React.useEffect(() => {
		loadingIdRef.current = loadingId;
	}, [loadingId]);

	async function actualizarEstado(id: string, estado: 'A' | 'I') {
		setLoadingId(id);
		setErrorMsg('');

		try {
			await fetchJson(`${getPostulantesApiBase()}/${encodeURIComponent(id)}/estado`, {
				method: 'PATCH',
				body: JSON.stringify({ estado }),
			});
		} catch (err: unknown) {
			setErrorMsg(getErrorMessage(err));
			throw err;
		} finally {
			setLoadingId(null);
		}
	}

	const fields = React.useMemo<GridColDef[]>(() => {
		const base = PostulantesDataSource.fields as GridColDef[];

		const activo: GridColDef = {
			field: 'activo',
			headerName: 'Activo',
			sortable: false,
			filterable: false,
			disableColumnMenu: true,
			width: 120,
			align: 'center',
			headerAlign: 'center',
			renderCell: (params: GridRenderCellParams<Postulante>) => {
				const row = params.row;

				const effectiveEstado = (estadoOverride[row.id] ?? row.estado) as 'A' | 'I';
				const isActivo = effectiveEstado === 'A';

				const currentLoadingId = loadingIdRef.current;
				const isLoading = currentLoadingId === row.id;

				return (
					<Box
						sx={{
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							width: '100%',
							height: '100%',
							gap: 1,
						}}
						onClick={(e) => e.stopPropagation()}
					>
						<Switch
							checked={isActivo}
							disabled={Boolean(currentLoadingId) && !isLoading}
							onChange={async (_e, checked) => {
								const nuevoEstado: 'A' | 'I' = checked ? 'A' : 'I';
								const anteriorEstado = (estadoOverride[row.id] ?? row.estado) as 'A' | 'I';

								setEstadoOverride((prev) => ({ ...prev, [row.id]: nuevoEstado }));
								params.api.updateRows([{ id: row.id, estado: nuevoEstado }]);

								try {
									await actualizarEstado(row.id, nuevoEstado);
								} catch {
									setEstadoOverride((prev) => {
										const next = { ...prev };
										if (anteriorEstado === row.estado) delete next[row.id];
										else next[row.id] = anteriorEstado;
										return next;
									});
									params.api.updateRows([{ id: row.id, estado: anteriorEstado }]);
								}
							}}
							slotProps={{ input: { 'aria-label': 'Cambiar estado del postulante' } }}
							sx={{ m: 0 }}
						/>

						{isLoading ? <CircularProgress size={18} /> : null}
					</Box>
				);
			},
		};

		return [...base, activo];
	}, []);

	const getMany = React.useCallback(async () => {
		const data = (await fetchJson(`${getPostulantesApiBase()}`)) as PostulanteApi[];
		setEstadoOverride({});
		const items = data.map(normalizePostulante);
		return { items, itemCount: items.length };
	}, []);

	const dataSource = React.useMemo(
		() => ({ ...PostulantesDataSource, fields, getMany }),
		[fields, getMany],
	);

	return (
		<>
			{errorMsg ? (
				<Alert severity='error' sx={{ mb: 2 }}>
					{errorMsg}
				</Alert>
			) : null}

			<List<Postulante>
				dataSource={dataSource}
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

							navigate(`/${empresa}/postulantes/${row.id}/${toSlug(displayName)}/postulaciones`);
						},
					},
				}}
			/>
		</>
	);
}
