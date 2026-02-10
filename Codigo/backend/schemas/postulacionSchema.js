import { z } from 'zod';

class PostulacionSchemas {
	static altaPostulacion = z.object({
		idVacante: z.coerce
			.number({
				invalid_type_error: 'El identificador de la vacante debe ser un número.',
				required_error: 'Falta el identificador de la vacante.',
			})
			.int('Debe ser un número entero.')
			.positive('Debe ser un número positivo.'),
	});
}

export default PostulacionSchemas;
