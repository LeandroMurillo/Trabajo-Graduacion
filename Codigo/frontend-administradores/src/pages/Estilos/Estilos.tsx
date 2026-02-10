import * as React from 'react';
import { CrudForm, type DataFieldFormValue } from '@toolpad/core/Crud';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import SmartPageContainer from '../SmartPageContainer';
import { getApiBase } from '../../App';
import { fetchJson } from '../../data/utils';

import {
	Alert,
	Box,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	Stack,
	Typography,
} from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';

import { estilosDataSource, type Estilos } from '../../data/estilos';
import PreviewPaginaUsuarios from './PreviewPaginaUsuarios';

type P = Record<string, string>;

const estilosRouteSpecs = [
	{
		path: '/estilos',
		title: 'Todos los estilos',
		breadcrumbs: [{ title: 'estilos', path: (p: P) => `/${p.empresa}/estilos` }],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={estilosRouteSpecs} />;
}

type FormState<T> = {
	values: Partial<T>;
	errors: Record<string, string | undefined>;
};

const API = getApiBase();

interface EstilosResponse {
	id?: string;
	primaryColor?: string;
	PrimaryColor?: string;
	palette?: {
		primary?: {
			main?: string;
		}
	}
}

function normalizeEstilosResponse(res: EstilosResponse): Estilos {
	const primary =
		res?.primaryColor ?? res?.PrimaryColor ?? res?.palette?.primary?.main ?? '#1976d2';

	return {
		id: String(res?.id ?? 'theme'),
		primaryColor: String(primary),
	};
}

function validateHexColor(text: string): string | null {
	if (!/^#[0-9A-Fa-f]{6}$/.test(text)) {
		return 'Color inválido. Usá formato #RRGGBB (ej: #1976d2)';
	}
	return null;
}

function buildMuiTheme(primaryColor: string) {
	return createTheme({
		palette: {
			primary: { main: primaryColor },
		},
	});
}

export default function EditarEstilos() {
	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);

	const [publishedPrimary, setPublishedPrimary] = React.useState('#1976d2');

	const [formState, setFormState] = React.useState<FormState<Estilos>>({
		values: { id: 'theme', primaryColor: '#1976d2' },
		errors: {},
	});

	const [openPreview, setOpenPreview] = React.useState(false);

	const isDirty = String(formState.values.primaryColor ?? '') !== String(publishedPrimary ?? '');

	async function cargarEstilos() {
		setLoading(true);
		try {
			const res = await fetchJson(`${API}/admin/estilos`);
			const normalized = normalizeEstilosResponse(res);

			setPublishedPrimary(normalized.primaryColor);
			setFormState({
				values: normalized,
				errors: {},
			});
		} finally {
			setLoading(false);
		}
	}

	async function guardarCambios() {
		const primaryColor = String(formState.values.primaryColor ?? '');
		const error = validateHexColor(primaryColor);

		if (error) {
			setFormState((prev) => ({
				...prev,
				errors: { ...prev.errors, primaryColor: error },
			}));
			return;
		}

		const confirm = window.confirm(
			'¿Guardar cambios de estilos? Esto afectará el sitio de usuarios.',
		);
		if (!confirm) return;

		setSaving(true);
		try {
			const res = await fetchJson(`${API}/admin/estilos`, {
				method: 'PUT',
				body: JSON.stringify({ primaryColor }),
				headers: { 'Content-Type': 'application/json' },
			});

			const normalized = normalizeEstilosResponse(res);

			setPublishedPrimary(normalized.primaryColor);
			setFormState({ values: normalized, errors: {} });
			setOpenPreview(false);
		} finally {
			setSaving(false);
		}
	}

	function descartarCambios() {
		if (!isDirty) {
			setOpenPreview(false);
			return;
		}

		const confirm = window.confirm('¿Descartar cambios? Se volverá al último estilo publicado.');
		if (!confirm) return;

		setFormState((prev) => ({
			values: { ...prev.values, id: 'theme', primaryColor: publishedPrimary },
			errors: {},
		}));
		setOpenPreview(false);
	}

	function handleFieldChange(field: string, value: DataFieldFormValue) {
		setFormState((prev) => {
			if (field === 'primaryColor') {
				const text = String(value ?? '');
				const err = validateHexColor(text);
				return {
					values: { ...prev.values, primaryColor: text },
					errors: { ...prev.errors, primaryColor: err ?? undefined },
				};
			}

			return {
				values: { ...prev.values, [field]: value },
				errors: prev.errors,
			};
		});
	}

	function handlePrevisualizar() {
		const primaryColor = String(formState.values.primaryColor ?? '');
		const error = validateHexColor(primaryColor);

		if (error) {
			setFormState((prev) => ({
				...prev,
				errors: { ...prev.errors, primaryColor: error },
			}));
			return;
		}

		setOpenPreview(true);
	}

	React.useEffect(function init() {
		cargarEstilos();
	}, []);

	if (loading) {
		return (
			<PageWrapper title='Estilos'>
				<Typography>Cargando estilos…</Typography>
			</PageWrapper>
		);
	}

	const primaryColor = String(formState.values.primaryColor ?? '#1976d2');
	const previewError = validateHexColor(primaryColor);
	const previewTheme = previewError ? null : buildMuiTheme(primaryColor);

	return (
		<PageWrapper title='Estilos'>
			<Stack spacing={2}>
				{isDirty ? (
					<Alert severity='warning'>Hay cambios sin publicar.</Alert>
				) : (
					<Alert severity='success'>Sin cambios pendientes.</Alert>
				)}

				<Box sx={{ '& form button[type="submit"]': { display: 'none' } }}>
					<CrudForm<Estilos>
						dataSource={estilosDataSource}
						formState={formState}
						onFieldChange={handleFieldChange}
						onSubmit={handlePrevisualizar}
						submitButtonLabel=' '
					/>
				</Box>

				<Stack direction='row' spacing={2} justifyContent='flex-end'>
					<Button variant='outlined' onClick={handlePrevisualizar} disabled={saving}>
						Previsualizar
					</Button>

					<Button
						variant='contained'
						onClick={guardarCambios}
						disabled={saving || Boolean(formState.errors.primaryColor) || !isDirty}
					>
						{saving ? 'Guardando…' : 'Guardar'}
					</Button>
				</Stack>

				<Dialog open={openPreview} onClose={() => setOpenPreview(false)} maxWidth='md' fullWidth>
					<DialogTitle>Previsualización de estilos</DialogTitle>

					<DialogContent dividers>
						<Stack spacing={2}>
							{previewError ? (
								<Alert severity='error'>{previewError}</Alert>
							) : previewTheme ? (
								<ThemeProvider theme={previewTheme}>
									<PreviewPaginaUsuarios />
								</ThemeProvider>
							) : (
								<Alert severity='error'>No se pudo construir el theme.</Alert>
							)}
						</Stack>
					</DialogContent>

					<DialogActions>
						<Button onClick={() => setOpenPreview(false)} disabled={saving}>
							Cerrar
						</Button>

						<Button onClick={descartarCambios} color='warning' disabled={saving}>
							Descartar cambios
						</Button>

						<Button
							onClick={guardarCambios}
							variant='contained'
							disabled={saving || Boolean(previewError) || !isDirty}
						>
							{saving ? 'Guardando…' : 'Guardar cambios'}
						</Button>
					</DialogActions>
				</Dialog>
			</Stack>
		</PageWrapper>
	);
}
