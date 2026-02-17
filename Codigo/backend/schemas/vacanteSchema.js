import { z } from 'zod';

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
};

export default VacanteSchema;
