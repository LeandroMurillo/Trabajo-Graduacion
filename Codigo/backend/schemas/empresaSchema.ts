import { z } from 'zod';

const idEmpresaSchema = z.coerce.number().int().positive();

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

const estadoEmpresaSchema = z.enum(['A', 'I']);

export const EmpresaSchema = z.object({
	empresa: empresaNombreSchema,
	url: slugSchema,
});

export const cambiarEstadoEmpresaSchema = z.object({
	id: idEmpresaSchema,
	estado: estadoEmpresaSchema,
});

const hexColor = z
	.string()
	.regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, 'Debe ser un color hexadecimal válido.');

export const estiloEmpresaSchema = z.object({
	cssVariables: z.boolean(),
	palette: z.object({
		primary: z.object({ main: hexColor }),
		secondary: z.object({ main: hexColor }),
		error: z.object({ main: hexColor }),
	}),
});

export const modificaEstiloEmpresaSchema = z.object({
	primaryColor: hexColor,
});

export const estiloEmpresaColorsSchema = z.object({
	primaryColor: hexColor.default('#556cd6'),
	secondaryColor: hexColor.default('#19857b'),
	errorColor: hexColor.default('#cc0000'),
});

export type EstiloEmpresaObj = z.infer<typeof estiloEmpresaSchema>;
export type EstiloEmpresa = EstiloEmpresaObj | null;

export type EstiloEmpresaColorsObj = z.infer<typeof estiloEmpresaColorsSchema>;
export type ModificaEstiloEmpresaObj = z.infer<typeof modificaEstiloEmpresaSchema>;
