import { z } from 'zod';

const categoria = z
	.string()
	.min(1, 'La categoría es requerida.')
	.max(50, 'La categoría no puede superar 50 caracteres.')
	.regex(/^[\p{L}\p{N} ._-]+$/u, 'La categoría contiene caracteres inválidos.')
	.transform((v) => v.replace(/\s+/g, ' '));

const orden = z.coerce
	.number()
	.int('El orden debe ser un número entero.')
	.min(1, 'El orden mínimo es 1.')
	.max(255, 'El orden máximo es 255.');

const estadoCategoria = z.enum(['A', 'I'], {
	errorMap: () => ({ message: 'Estado inválido. Use A o I.' }),
});

export default class CategoriaSchema {
	static altaCategoria = z.object({
		categoria,
	});

	static modificaCategoria = z.object({
		categoria,
		orden,
	});

	static cambiarEstadoCategoria = z.object({
		estado: estadoCategoria,
	});
}
