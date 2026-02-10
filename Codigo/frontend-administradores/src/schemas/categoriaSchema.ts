import { z } from 'zod';

const categoria = z.preprocess(
	(v) => (typeof v === 'string' ? v.trim().replace(/\s+/g, ' ') : v),
	z
		.string({ required_error: 'El nombre de la categoría es obligatorio.' })
		.min(1, 'La categoría no puede estar vacía.')
		.max(50, 'La categoría no puede superar 50 caracteres.')
		.regex(/^[\p{L}\p{N} ._-]+$/u, 'La categoría contiene caracteres inválidos.'),
);

const orden = z.coerce
	.number()
	.int('El orden debe ser un número entero.')
	.min(1, 'El orden mínimo es 1.')
	.max(255, 'El orden máximo es 255.');

const estadoCategoria = z.enum(['A', 'I'], {
	errorMap: () => ({ message: 'Estado inválido. Use A o I.' }),
});

export const CategoriaSchema = z.object({
	categoria,
	orden: orden.optional(),
});

export const CambiarEstadoCategoriaSchema = z.object({
	estado: estadoCategoria,
});
