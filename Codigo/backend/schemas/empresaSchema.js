import { z } from 'zod';

const slugSchema = z
	.string()
	.trim()
	.min(1, 'El slug es obligatorio.')
	.max(100)
	.regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'La url debe ser un slug (minúsculas, números y guiones).');

const empresaNombreSchema = z
	.string()
	.trim()
	.min(1, 'El nombre de la empresa es obligatorio.')
	.max(100);

export const EmpresaSchema = z.object({
	empresa: empresaNombreSchema,
	url: slugSchema,
});

export const estiloEmpresaSchema = z.object({
	primaryColor: z
		.string()
		.regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Debe ser un color hexadecimal válido.')
		.default('#556cd6'),
	secondaryColor: z
		.string()
		.regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Debe ser un color hexadecimal válido.')
		.default('#19857b'),
	errorColor: z
		.string()
		.regex(/^#([0-9A-Fa-f]{3}){1,2}$/, 'Debe ser un color hexadecimal válido.')
		.default('#cc0000'),
});