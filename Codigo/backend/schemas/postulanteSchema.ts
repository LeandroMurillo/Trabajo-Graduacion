import { z } from 'zod';

function trimOrNull(v: unknown) {
	if (v == null) return null;
	const s = String(v).trim();
	return s.length ? s : null;
}

const IdPostulanteSchema = z.string().length(28, 'El id de postulante debe tener 28 caracteres.');
const GeneroSchema = z.enum(['M', 'F', 'X']);
const EstadoPostulanteSchema = z.enum(['P', 'A', 'I']); // Pendiente, Activo, Inactivo

const FechaYMD = z
	.string({
		required_error: 'La fecha de nacimiento es obligatoria.',
		invalid_type_error: 'La fecha de nacimiento debe ser una cadena.',
	})
	.trim()
	.refine((s) => /^\d{4}-\d{2}-\d{2}$/.test(s), {
		message: 'La fecha debe tener formato YYYY-MM-DD.',
	})
	.refine(
		(s) => {
			const [y, m, d] = s.split('-').map(Number);
			const dt = new Date(Date.UTC(y, m - 1, d));

			return dt.getUTCFullYear() === y && dt.getUTCMonth() === m - 1 && dt.getUTCDate() === d;
		},
		{
			message: 'La fecha no es válida.',
		},
	);

export const IdTokenSchema = z
	.string({
		required_error: 'idToken es obligatorio.',
		invalid_type_error: 'idToken debe ser una cadena.',
	})
	.trim()
	.min(1, 'idToken es obligatorio.')
	.max(5000, 'idToken inválido.');

export const PostulanteSchema = z.object({
	id: IdPostulanteSchema,
	nombres: z.string().trim().min(1, 'El nombre es obligatorio.').max(100),
	apellidos: z.string().trim().min(1, 'El apellido es obligatorio.').max(100),
	email: z.string().trim().email('Email inválido.').max(256),
	cuil: z.string().trim().length(11, 'El CUIL debe tener 11 dígitos.').nullable(),
	fechaNacimiento: FechaYMD,
	genero: GeneroSchema,
	localidad: z.string().trim().max(100).nullable(),
	telefono: z.string().trim().max(15).nullable(),
	observaciones: z.string().trim().nullable(),
	estado: EstadoPostulanteSchema,
	habilidades: z.union([z.array(z.string()), z.string(), z.null()]).optional(),
});

export const registrarPostulanteSchema = z.object({
	nombres: PostulanteSchema.shape.nombres,
	apellidos: PostulanteSchema.shape.apellidos,
	genero: PostulanteSchema.shape.genero,
	fechaNacimiento: PostulanteSchema.shape.fechaNacimiento,
	idToken: IdTokenSchema,
});

export const loginSchema = z.object({
	idToken: IdTokenSchema,
});

export const dameDatosPerfilSchema = z.object({
	nombres: PostulanteSchema.shape.nombres,
	apellidos: PostulanteSchema.shape.apellidos,
	email: PostulanteSchema.shape.email,
	cuil: PostulanteSchema.shape.cuil,
	fechaNacimiento: PostulanteSchema.shape.fechaNacimiento,
	genero: PostulanteSchema.shape.genero,
	localidad: PostulanteSchema.shape.localidad,
	telefono: PostulanteSchema.shape.telefono,
});

export const modificarDatosPerfilBodySchema = z.object({
	nombres: z.preprocess(trimOrNull, z.string().min(1).max(100).nullable()).optional(),
	apellidos: z.preprocess(trimOrNull, z.string().min(1).max(100).nullable()).optional(),
	cuil: z
		.preprocess(trimOrNull, z.string().length(11, 'El CUIL debe tener 11 dígitos.').nullable())
		.optional(),
	genero: GeneroSchema.nullable().optional(),
	localidad: z.preprocess(trimOrNull, z.string().max(100).nullable()).optional(),
	telefono: z.preprocess(trimOrNull, z.string().max(15).nullable()).optional(),
	habilidades: z
		.array(z.string().trim().min(1).max(20, 'Cada habilidad no puede superar 20 caracteres.'))
		.max(5, 'No se pueden enviar más de 5 habilidades.')
		.optional(),
});

export const activarUsuarioSchema = z.object({
	oobCode: z.string().trim().min(1, 'oobCode es obligatorio.'),
});

export const cambiarEstadoPostulanteBodySchema = z.object({
	estado: z.enum(['A', 'I']),
});

export const activarCuentaPorCodigoSchema = z.object({
	oobCode: z
		.string({
			required_error: 'oobCode es obligatorio.',
			invalid_type_error: 'oobCode debe ser una cadena.',
		})
		.trim()
		.min(1, 'oobCode es obligatorio.')
		.max(1000, 'oobCode inválido.'),
});
