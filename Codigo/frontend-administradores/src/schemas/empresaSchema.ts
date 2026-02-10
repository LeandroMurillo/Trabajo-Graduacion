import { z } from 'zod';

const slugSchema = z
	.string({ required_error: 'el slug de la empresa es obligatorio.' })
	.trim()
	.min(1, 'El slug no puede estar vacío')
	.max(100)
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'La url debe ser un slug (minúsculas, números y guiones).');

const empresaNombreSchema = z
	.string({ required_error: 'el nombre de la empresa es obligatorio.' })
	.trim()
	.min(1, 'El nombre de la empresa no puede estar vacio')
	.max(100);

export const EmpresaSchema = z.object({
	empresa: empresaNombreSchema,
	url: slugSchema,
});
