import { z } from 'zod';

const emailSchema = z
	.string()
	.trim()
	.email('EMAIL_INVALIDO')
	.max(256, 'EMAIL_LARGO')
	.transform((v) => v.toLowerCase());

const empresaSchema = z
	.string()
	.trim()
	.min(1, 'EMPRESA_INVALIDA')
	.max(100, 'EMPRESA_LARGA')
	.transform((v) => v.replace(/\s+/g, ' '));
const claveSchema = z.string().trim().min(8, 'CLAVE_CORTA').max(128, 'CLAVE_LARGA');

export default class AdministradorSchema {
	static adminIdParams = z.object({
		id: z.coerce.number().int().positive().max(65535),
	});

	static altaAdministrador = z.object({
		email: emailSchema,
		empresa: empresaSchema,
		clave: claveSchema,
	});

	static modificaAdministrador = z
		.object({
			email: emailSchema.optional(),
			empresa: empresaSchema.optional(),
			clave: claveSchema.optional(),
		})
		.superRefine((data, ctx) => {
			if (!data.email && !data.empresa && !data.clave) {
				ctx.addIssue({ code: z.ZodIssueCode.custom, message: 'SIN_CAMBIOS', path: [] });
			}
		});
}
