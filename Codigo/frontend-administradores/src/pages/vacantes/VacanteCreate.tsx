import * as React from 'react';
import { Box, Stack, Button } from '@mui/material';
import { CrudForm, type DataFieldFormValue } from '@toolpad/core/Crud';
import { useLocation, useNavigate, useParams } from 'react-router';
import { fromSlug } from '../../data/utils';
import { type Vacante } from '../../data/vacantes';
import { useVacantesDataSource } from './useVacantesDataSource';

import SmartPageContainer from '../SmartPageContainer';
import { routeSpecs } from './routeSpecs';

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

export default function VacanteCreate() {
	const { pathname } = useLocation();
	const { slug } = useParams<{ slug?: string }>();
	const navigate = useNavigate();

	const rootPath = React.useMemo(() => pathname.replace(/\/new$/, ''), [pathname]);

	const isCategoriaView = Boolean(slug);
	const dataSource = useVacantesDataSource({ isCategoriaView, slug });

	const categoriaPrefill = React.useMemo(
		() => (isCategoriaView && slug ? fromSlug(slug, 'title') : undefined),
		[isCategoriaView, slug],
	);

	const defaults = React.useMemo<Partial<Vacante>>(
		() => ({
			tipoTrabajo: 'Sin Especificar',
			modalidad: 'Sin Especificar',
			nivelExperiencia: 'Sin Especificar',
			...(categoriaPrefill ? { categoria: categoriaPrefill } : {}),
		}),
		[categoriaPrefill],
	);

	const [values, setValues] = React.useState<Partial<Vacante>>(defaults);
	const [errors, setErrors] = React.useState<FormErrors>({});
	const [submitting, setSubmitting] = React.useState(false);

	React.useEffect(() => {
		setValues(defaults);
		setErrors({});
	}, [defaults]);

	React.useEffect(() => {
		if (categoriaPrefill && !values.categoria) {
			setValues((prev) => ({ ...prev, categoria: categoriaPrefill }) as Partial<Vacante>);
		}
	}, [categoriaPrefill, values.categoria]);

	const onFieldChange = React.useCallback(
		<K extends keyof Vacante>(name: K, value: DataFieldFormValue) => {
			setValues((prev) => ({ ...prev, [name]: value as Vacante[K] }));

			// limpia error del campo que se está editando
			setErrors((prev) => {
				if (!prev[name]) return prev;
				const next = { ...prev };
				delete next[name];
				return next;
			});
		},
		[],
	);

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

	async function save(estado: 'B' | 'P') {
		const v = validateCurrentValues();
		if (!v.ok) return;

		setSubmitting(true);
		try {
			await dataSource.createOne({ ...values, estado } as Partial<Vacante>);
			navigate(rootPath);
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<SmartPageContainer routeSpecs={routeSpecs}>
			<Box sx={{ '& form button[type="submit"]': { display: 'none' } }}>
				<CrudForm<Vacante>
					dataSource={dataSource}
					formState={{ values, errors }}
					onFieldChange={onFieldChange}
					onSubmit={() => save('B')}
					submitButtonLabel='Guardar'
				/>
			</Box>

			<Stack direction='row' justifyContent='flex-end' spacing={3} mt={2}>
				<Button variant='contained' onClick={() => save('P')} disabled={submitting}>
					Publicar
				</Button>
				<Button variant='contained' onClick={() => save('B')} disabled={submitting}>
					Guardar como borrador
				</Button>
			</Stack>
		</SmartPageContainer>
	);
}
