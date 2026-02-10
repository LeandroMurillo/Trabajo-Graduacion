import { z } from 'zod';

class CurriculumSchemas {
	// Esquema para validar el archivo del curriculum
	static fileSchema = z.object({
		nombre: z
			.string()
			.max(50, { message: 'El nombre del archivo es demasiado largo' })
			.transform((valorOriginal) => Buffer.from(valorOriginal, 'latin1').toString('utf8')),
		mimetype: z.enum(['application/pdf']), // Solo acepta PDFs
		tamaño: z
			.number()
			.max(1 * 1024 * 1024, { message: 'El archivo supera el tamaño máximo de 1MB' }), // Máximo 1 MB
		data: z.instanceof(Buffer), // El archivo debe ser un Buffer
		hash: z.string().regex(/^[a-fA-F0-9]{64}$/), // Valida que sea un SHA‑256
	});

	// Esquema completo para validar body y archivo al crear curriculum
	static altaCurriculumSchema = z.object({
		idPostulante: z.string().length(28),
		curriculum: z.object({
			nombre: z.string().min(1).max(50),
			mimetype: z.string().min(1),
			tamaño: z.number().int().nonnegative(),
			archivo: z.instanceof(Buffer),
			hash: z.string().length(64),
		}),
	});

	// Esquema para validar datos al solicitar un curriculum (solo se requiere el nombre del archivo)
	static dameCurriculumSchema = z.object({
		idEmpresa: z.number(),
		idPostulante: z.string().length(28),
		curriculum: z.string().max(50),
	});

	// Esquema para validar datos al borrar un curriculum (solo se requiere el nombre del archivo)
	static borrarCurriculumSchema = z.object({
		idEmpresa: z.number(),
		idPostulante: z.string().length(28),
		curriculum: z.string().max(50),
	});
}

export default CurriculumSchemas;
