import { z } from 'zod';

const DEFAULT_PAGE = 0;
const DEFAULT_PAGE_SIZE = 25;
const MAX_PAGE_SIZE = 200;

const SORT_FIELDS = [
	'categoria',
	'titulo',
	'vacante',
	'localidad',
	'nivelExperiencia',
	'publicacion',
	'fechaPublicacion',
	'cierre',
	'fechaCierre',
	'estado',
	'fechaCreacion',
];

function normalizeSortField(raw) {
	switch (raw) {
		case 'categoria':
			return 'categoria';

		case 'titulo':
		case 'vacante':
			return 'vacante';

		case 'localidad':
			return 'localidad';

		case 'nivelExperiencia':
			return 'nivelExperiencia';

		case 'publicacion':
		case 'fechaPublicacion':
			return 'fechaPublicacion';

		case 'cierre':
		case 'fechaCierre':
			return 'fechaCierre';

		case 'estado':
			return 'estado';

		case 'fechaCreacion':
		default:
			return 'fechaCreacion';
	}
}

function normalizeSortDir(raw) {
	return String(raw).trim().toLowerCase() === 'asc' ? 'asc' : 'desc';
}

const F = {
	id: z.coerce.number().int().positive(),

	categoria: z.string().max(50),
	vacante: z.string().max(45),
	descripcion: z.string(),

	tipoTrabajoAlta: z.enum(['Sin Especificar', 'Tiempo Completo', 'Medio Tiempo', 'Contrato']),
	modalidadAlta: z.enum(['Sin Especificar', 'Presencial', 'Remoto', 'Híbrido']),

	localidad: z
		.string()
		.max(100)
		.optional()
		.transform((v) => (v && v.trim() ? v : null)),

	nivelExperiencia: z
		.enum(['Junior', 'SemiSenior', 'Senior'])
		.nullable()
		.optional()
		.transform((v) => v ?? null),

	habilidadesAlta: z
		.union([z.string(), z.record(z.string(), z.string())])
		.optional()
		.transform((v) => v ?? null),

	habilidadesModifica: z
		.string()
		.or(z.record(z.string(), z.string()))
		.optional()
		.transform((v) => v ?? {}),

	estadoAlta: z.enum(['B', 'P']),
	estadoModifica: z
		.enum(['B', 'P', 'C'])
		.optional()
		.transform((v) => v ?? null),

	tipoTrabajoModifica: z.enum(['Tiempo Completo', 'Medio Tiempo', 'Remoto', 'Híbrido']).optional(),
	modalidadModifica: z.enum(['Presencial', 'Remoto', 'Híbrido']).optional(),
};

const VacanteSchema = {
	borraVacante: z.object({
		id: F.id,
	}),

	altaVacante: z.object({
		categoria: F.categoria,
		vacante: F.vacante,
		descripcion: F.descripcion,
		tipoTrabajo: F.tipoTrabajoAlta,
		modalidad: F.modalidadAlta,
		localidad: F.localidad,
		nivelExperiencia: F.nivelExperiencia,
		habilidades: F.habilidadesAlta,
		estado: F.estadoAlta,
	}),

	modificaVacante: z
		.object({
			vacante: F.vacante.optional(),
			descripcion: z.string().optional(),
			tipoTrabajo: F.tipoTrabajoModifica,
			modalidad: F.modalidadModifica,
			localidad: F.localidad,
			nivelExperiencia: F.nivelExperiencia,
			habilidades: F.habilidadesModifica,
			estado: F.estadoModifica,
		})
		.partial(),

	dameVacantes: z
		.object({
			categoria: z
				.union([z.string().min(1), z.literal('')])
				.optional()
				.transform((v) => (v && v.trim() !== '' ? v : null)),

			page: z.coerce.number().int().min(0).optional().default(DEFAULT_PAGE),

			pageSize: z.coerce
				.number()
				.int()
				.min(1)
				.max(MAX_PAGE_SIZE)
				.optional()
				.default(DEFAULT_PAGE_SIZE),

			sortField: z
				.string()
				.optional()
				.transform((v) => String(v ?? '').trim())
				.refine((v) => v === '' || SORT_FIELDS.includes(v), { message: 'sortField inválido' })
				.transform((v) => normalizeSortField(v)),

			sortDir: z
				.string()
				.optional()
				.transform((v) => normalizeSortDir(v)),
		})
		.transform((q) => {
			const offset = q.page * q.pageSize;

			return {
				categoria: q.categoria,
				page: q.page,
				pageSize: q.pageSize,
				offset,
				sortField: q.sortField || 'fechaCreacion',
				sortDir: q.sortDir || 'desc',
			};
		}),
};

export default VacanteSchema;
