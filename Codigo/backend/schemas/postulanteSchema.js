import { z } from 'zod';

export const PostulanteSchema = z.object({
	uuidFirebase: z.string().length(28),
	nombres: z.string().min(1).max(100), // habría que revisar las restricciones de la bd
	apellidos: z.string().min(1).max(100),
	email: z.string().email({}).max(256),
	contraseña: z.string().min(0).max(100), //tendría que coincidir con las restricciones de firebase
	cuil: z.string().length(11),
	fechaNacimiento: z
		.string()
		.refine(
			(val) => {
				// Validar formato DD-MM-AAAA o DD/MM/AAAA
				const regex = /^\d{2}[-/]\d{2}[-/]\d{4}$/;
				if (!regex.test(val)) return false;

				// Separar valores
				const [day, month, year] = val.split(/[-/]/).map(Number);

				// Crear un objeto de fecha y validar que sea válida
				const parsedDate = new Date(year, month - 1, day);
				return (
					parsedDate.getFullYear() === year &&
					parsedDate.getMonth() === month - 1 &&
					parsedDate.getDate() === day
				);
			},
			{ message: 'La fecha de nacimiento no es válida.' },
		)
		.transform((val) => {
			// Convertir a un objeto Date
			const [day, month, year] = val.split(/[-/]/).map(Number);
			return new Date(year, month - 1, day);
		}),
	genero: z.enum(['F', 'M', 'X']),
	localidad: z.string().min(1).max(100),
	telefono: z.string().min(1).max(15),
	observaciones: z.string().min(0),
	estado: z.enum(['Activo', 'Inactivo', 'Pendiente']),
	habilidades: z.string(),
});

export const registrarPostulanteSchema = PostulanteSchema.pick({
	nombres: true,
	apellidos: true,
	email: true,
	contraseña: true,
	genero: true,
	fechaNacimiento: true,
});

export const loginSchema = PostulanteSchema.pick({
	email: true,
	contraseña: true,
});

export const dameDatosPerfilSchema = PostulanteSchema.pick({
	// idPostulante: true, // ELIMINADO: No existe en PostulanteSchema
	nombres: true,
	apellidos: true,
	email: true,
	cuil: true,
	fechaNacimiento: true,
	genero: true,
	localidad: true,
	telefono: true,
});

export const modificarDatosPerfilSchema = dameDatosPerfilSchema
	.omit({ idPostulante: true })
	.partial()
	.extend({ idPostulante: z.string() }); // CORREGIDO: Definido explícitamente

export const activarUsuarioSchema = z.object({
	oobCode: z.string().nonempty(),
});

export const postulanteSchema = z.object({
	nombres: z.string().min(1).max(100), // Obligatorio, entre 1 y 100 caracteres
	apellidos: z.string().min(1).max(100), // Obligatorio, entre 1 y 100 caracteres
	email: z.string().email(), // Validar que sea un email válido
	contraseña: z.string(), // Obligatoria

	genero: z.enum(['M', 'F', 'X']), // Valores predefinidos
});
