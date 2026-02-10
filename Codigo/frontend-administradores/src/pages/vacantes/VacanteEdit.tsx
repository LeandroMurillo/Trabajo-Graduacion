import * as React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { CrudForm, type DataFieldFormValue, type DataModelId } from '@toolpad/core/Crud';
import SmartPageContainer from '../SmartPageContainer';
import { routeSpecs } from './routeSpecs';
import { useParams, useNavigate } from 'react-router';
import { useVacantesDataSource } from './useVacantesDataSource';
import { type Vacante } from '../../data/vacantes';

type FormErrors = Partial<Record<keyof Vacante, string>>;

function issuePathToKey(path: unknown): keyof Vacante | null {
	if (!Array.isArray(path) || path.length === 0) return null;
	const first = path[0];
	if (typeof first !== 'string') return null;
	return first as keyof Vacante;
}

interface ValidationResult {
	issues?: Array<{ path: unknown[]; message: string }>;
	values?: unknown;
}

export default function VacanteEdit() {
	const { empresa, idVacante, slug } = useParams<{
		empresa: string;
		idVacante: string;
		slug?: string;
	}>();
	const navigate = useNavigate();

	const isCategoriaView = Boolean(slug);
	const dataSource = useVacantesDataSource({ isCategoriaView, slug });

	const [loading, setLoading] = React.useState(true);
	const [saving, setSaving] = React.useState(false);
	const [toggling, setToggling] = React.useState(false);

	const [record, setRecord] = React.useState<Vacante | null>(null);
	const [values, setValues] = React.useState<Partial<Vacante>>({});
	const [errors, setErrors] = React.useState<FormErrors>({});

	const listPath =
		isCategoriaView && slug ? `/${empresa}/categorias/${slug}/vacantes` : `/${empresa}/vacantes`;

	React.useEffect(() => {
		let mounted = true;

		(async () => {
			if (!idVacante) return;
			setLoading(true);
			try {
				const item = await dataSource.getOne!(idVacante as unknown as DataModelId);
				if (!mounted) return;
				setRecord(item);
				setValues(item);
				setErrors({});
			} finally {
				if (mounted) setLoading(false);
			}
		})();

		return () => {
			mounted = false;
		};
	}, [idVacante, dataSource]);

	function handleFieldChange<K extends keyof Vacante>(name: K, value: DataFieldFormValue) {
		setValues((prev) => ({ ...prev, [name]: value as Vacante[K] }));
		setErrors((prev) => {
			if (!prev[name]) return prev;
			const next = { ...prev };
			delete next[name];
			return next;
		});
	}

	function buildPayloadSinEstado() {
		const payload = { ...values } as Partial<Vacante>;
		delete payload.estado;
		return payload as Partial<Omit<Vacante, 'id'>>;
	}

	function validateCurrentValues(): { ok: true } | { ok: false } {
		const validate = dataSource.validate;
		if (!validate) return { ok: true };

		const res = validate(values) as ValidationResult;
		const issues = Array.isArray(res?.issues) ? res.issues : [];

		if (issues.length === 0) {
			setErrors({});
			if (res?.values && typeof res.values === 'object') {
				setValues((prev) => ({ ...prev, ...(res.values as Partial<Vacante>) }));
			}
			return { ok: true };
		}

		const nextErrors: FormErrors = {};
		for (const issue of issues) {
			const key = issuePathToKey(issue?.path);
			if (!key) continue;
			if (!nextErrors[key]) nextErrors[key] = String(issue?.message ?? 'Campo inválido.');
		}

		setErrors(nextErrors);
		return { ok: false };
	}

	async function handleSubmit() {
		if (!idVacante) return;

		const v = validateCurrentValues();
		if (!v.ok) return;

		setSaving(true);
		try {
			const updated = await dataSource.updateOne!(
				idVacante as unknown as DataModelId,
				buildPayloadSinEstado(),
			);
			setRecord(updated);
			setValues(updated);
			setErrors({});
			navigate(listPath, { replace: true });
		} finally {
			setSaving(false);
		}
	}

	const currentEstado = (record?.estado ?? 'B') as 'B' | 'P' | 'C';
	const toggleLabel =
		currentEstado === 'B' ? 'Publicar' : currentEstado === 'P' ? 'Cerrar' : 'Publicar';

	async function handleToggleEstado() {
		if (!idVacante || !record) return;

		const v = validateCurrentValues();
		if (!v.ok) return;

		setToggling(true);
		try {
			const nextEstado: 'P' | 'C' = currentEstado === 'B' ? 'P' : currentEstado === 'P' ? 'C' : 'P';

			const payload = { ...buildPayloadSinEstado(), estado: nextEstado };

			const updated = await dataSource.updateOne!(idVacante as unknown as DataModelId, payload);

			setRecord(updated);
			setValues(updated);
			setErrors({});
			navigate(listPath, { replace: true });
		} finally {
			setToggling(false);
		}
	}

	const disabled = loading || !record || saving || toggling;

	return (
		<SmartPageContainer routeSpecs={routeSpecs}>
			<Box sx={{ '& form button[type="submit"]': { display: 'none' } }}>
				<CrudForm<Vacante>
					dataSource={dataSource}
					formState={{ values, errors }}
					onFieldChange={handleFieldChange}
					onSubmit={handleSubmit}
					submitButtonLabel='Guardar cambios'
				/>
			</Box>

			<Stack
				direction='row'
				spacing={1}
				justifyContent='flex-end'
				sx={{ position: 'sticky', bottom: 0, bgcolor: 'background.paper' }}
			>
				<Button variant='outlined' onClick={handleToggleEstado} disabled={disabled}>
					{toggling ? 'Procesando…' : toggleLabel}
				</Button>

				<Button variant='contained' onClick={handleSubmit} disabled={disabled}>
					{saving ? 'Guardando…' : 'Guardar cambios'}
				</Button>
			</Stack>
		</SmartPageContainer>
	);
}
