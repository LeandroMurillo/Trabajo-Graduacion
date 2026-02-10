import { z } from 'zod';

export const tipoTrabajoEnum = z.enum([
	'Sin Especificar',
	'Tiempo Completo',
	'Medio Tiempo',
	'Remoto',
	'Híbrido',
]);

export const modalidadEnum = z.enum(['Sin Especificar', 'Presencial', 'Remoto', 'Híbrido']);
export const nivelExperienciaEnum = z.enum(['Sin Especificar', 'Junior', 'SemiSenior', 'Senior']);
export const estadoVacanteEnum = z.enum(['B', 'P', 'C']);

function trimOrNull(value: unknown) {
	if (value == null) return null;
	const s = String(value).trim();
	return s.length ? s : null;
}

function splitCommaList(input: string) {
	return input
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

export const habilidadesSchema = z
	.union([z.string(), z.array(z.string()), z.null(), z.undefined()])
	.transform((v) => {
		if (Array.isArray(v))
			return v
				.map(String)
				.map((s) => s.trim())
				.filter(Boolean);
		if (typeof v === 'string') return splitCommaList(v);
		return [];
	});

export const vacanteSchema = z.object({
	vacante: z
		.string({ required_error: 'El título es obligatorio.' })
		.trim()
		.min(1, 'El título no puede estar vacío')
		.max(120),

	categoria: z.string({ required_error: 'Seleccioná una categoría.' }),
	descripcion: z.preprocess(trimOrNull, z.string().max(4000).nullable()),
	tipoTrabajo: tipoTrabajoEnum,
	modalidad: modalidadEnum,
	localidad: z.preprocess(trimOrNull, z.string().max(120).nullable()),
	nivelExperiencia: nivelExperienciaEnum
		.nullable()
		.transform((v) => (v === 'Sin Especificar' ? null : v)),
	habilidades: habilidadesSchema,
});
