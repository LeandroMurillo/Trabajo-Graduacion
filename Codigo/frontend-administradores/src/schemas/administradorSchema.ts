import { z } from 'zod';

export const emailSchema = z
	.string({
		required_error: 'El correo es obligatorio.',
	})
	.trim()
	.min(1, 'El correo no puede estar vacío.')
	.max(256, 'El correo no puede superar 256 caracteres.')
	.email('El texto ingresado no es un correo válido.');

export const empresaSchema = z
	.string({
		required_error: 'Debe seleccionar una empresa.',
	})
	.trim()
	.min(1, 'Debe seleccionar una empresa.')
	.max(100, 'La empresa no puede superar 100 caracteres.');

export const passwordSchema = z
	.string()
	.trim()
	.min(8, 'La contraseña debe tener al menos 8 caracteres.')
	.max(128, 'La contraseña es demasiado larga.');

export const AdministradorSchema = z
	.object({
		id: z.coerce.number().int().positive().optional(),
		email: emailSchema,
		empresa: empresaSchema,
		rol: z.enum(['ADMIN']).optional(),
		clave: z.string().optional(),
		confirmarClave: z.string().optional(),
	})
	.passthrough()
	.superRefine((data, ctx) => {
		const clave = (data.clave ?? '').trim();
		const confirmar = (data.confirmarClave ?? '').trim();

		// Si no se toca ninguna, OK (especialmente en edición)
		if (!clave && !confirmar) return;

		// Si se tocó alguna, deben venir ambas
		if (!clave) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['clave'],
				message: 'Debe ingresar la contraseña.',
			});
			return;
		}
		if (!confirmar) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['confirmarClave'],
				message: 'Debe confirmar la contraseña.',
			});
			return;
		}

		// Reglas de password
		const passCheck = passwordSchema.safeParse(clave);
		if (!passCheck.success) {
			for (const issue of passCheck.error.issues) {
				ctx.addIssue({ ...issue, path: ['clave'] });
			}
			return;
		}

		if (clave !== confirmar) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['confirmarClave'],
				message: 'Las contraseñas no coinciden.',
			});
		}
	});
