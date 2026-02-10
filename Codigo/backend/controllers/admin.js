import Empresa from '../models/empresas.js';
import { ZodError } from 'zod';
import Vacante from '../models/vacantes.js';
import Postulacion from '../models/postulaciones.js';
import Categoria from '../models/categorias.js';
import Postulante from '../models/postulantes.js';
import { estiloEmpresaSchema } from '../schemas/empresaSchema.js';
import CategoriaSchema from '../schemas/categoriaSchema.js';
import VacanteSchema from '../schemas/vacanteSchema.js';
import Curriculum from '../models/curriculums.js';

export default class AdminController {
	static getIdEmpresa(req, res) {
		if (req.empresa?.idEmpresa) {
			return req.empresa.idEmpresa;
		}

		if (!req.user?.idEmpresa) {
			res.status(401).json({ error: 'Token sin empresa asociada.' });
			return null;
		}
		return req.user.idEmpresa;
	}

	static async dameEstiloEmpresa(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const estilo = await Empresa.dameEstiloEmpresa(idEmpresa);

			if (estilo == null) {
				return res.status(404).json({ error: 'No se encontró el estilo de la empresa.' });
			}

			return res.status(200).json(estilo);
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.name === 'NOT_FOUND' || msg.includes('EMPRESA_NO_ENCONTRADA')) {
				return res.status(404).json({ error: 'Empresa no encontrada.' });
			}

			console.error('Error al obtener estilo empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async modificaEstiloEmpresa(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const { primaryColor, secondaryColor, errorColor } = req.body;

			const datosValidados = estiloEmpresaSchema.parse({
				primaryColor,
				secondaryColor,
				errorColor,
			});

			const estilo = {
				cssVariables: true,
				palette: {
					primary: { main: datosValidados.primaryColor },
					secondary: { main: datosValidados.secondaryColor },
					error: { main: datosValidados.errorColor },
				},
			};

			const { mensaje } = await Empresa.modificaEstiloEmpresa(idEmpresa, estilo);

			if (mensaje !== 'OK') {
				return res.status(400).json({ error: mensaje });
			}

			return res.status(200).json({
				primaryColor: datosValidados.primaryColor,
				secondaryColor: datosValidados.secondaryColor,
				errorColor: datosValidados.errorColor,
			});
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.name === 'NOT_FOUND' || msg.includes('EMPRESA_NO_ENCONTRADA')) {
				return res.status(404).json({ error: 'Empresa no encontrada.' });
			}

			console.error('Error al modificar estilo:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async dameCategorias(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const estadoCat = req.query.estado;
			const estadoParam = estadoCat === 'A' || estadoCat === 'I' ? estadoCat : null;

			const categorias = await Categoria.dameCategorias(idEmpresa, estadoParam);

			return res.status(200).json(categorias);
		} catch (error) {
			console.error('Error al obtener categorías:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameCategoria(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const idCategoria = Number(req.params.id);

			if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
				return res.status(400).json({ error: 'ID inválido.' });
			}

			const categoria = await Categoria.dameCategoria(idEmpresa, idCategoria);
			return res.status(200).json(categoria);
		} catch (error) {
			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				const msg = String(error?.sqlMessage ?? error?.message ?? '');

				if (msg.includes('CATEGORIA_NO_EXISTE')) {
					return res.status(404).json({ error: 'No se pudo encontrar la categoría' });
				}

				return res.status(409).json({ error: 'Operación no permitida.' });
			}

			console.error('getOne categoria:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async altaCategoria(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		try {
			const data = CategoriaSchema.altaCategoria.parse(req.body);
			const categoriaCreada = await Categoria.altaCategoria(idEmpresa, data);
			return res.status(201).json(categoriaCreada);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					error: 'Validación fallida',
					issues: error.issues,
				});
			}

			if (error?.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({
					error: 'Ya existe una categoría con ese nombre.',
				});
			}

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				switch (error.message) {
					case 'LIMITE_MAXIMO_CATEGORIAS':
						return res.status(409).json({
							error: 'Se alcanzó el límite máximo de categorías.',
						});

					default:
						return res.status(400).json({ error: error.message });
				}
			}

			console.error('Error al registrar categoría:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async modificaCategoria(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const idCategoria = Number(req.params.id);

			if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
				return res.status(400).json({ error: 'ID inválido.' });
			}

			const data = CategoriaSchema.modificaCategoria.parse(req.body);

			const categoriaActualizada = await Categoria.modificaCategoria(idEmpresa, idCategoria, data);

			return res.status(200).json(categoriaActualizada);
		} catch (error) {
			if (error?.name === 'ZodError') {
				return res.status(400).json({ error: 'Datos inválidos.', issues: error.errors });
			}

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				let code = String(error?.sqlMessage ?? error?.message ?? '').trim();

				switch (code) {
					case 'CATEGORIA_NO_ENCONTRADA':
						return res.status(404).json({ error: 'No se pudo encontrar la categoría.' });

					case 'CATEGORIA_DUPLICADA':
						return res.status(409).json({ error: 'Ya existe una categoría con ese nombre.' });

					default:
						return res.status(400).json({ error: 'Operación inválida.' });
				}
			}
		}
	}

	static async cambiarEstadoCategoria(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const idCategoria = Number(req.params.id);
			if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
				return res.status(400).json({ error: 'idCategoria inválido.' });
			}

			const { estado } = CategoriaSchema.cambiarEstadoCategoria.parse(req.body);

			const mensaje = await Categoria.cambiarEstadoCategoria(idEmpresa, idCategoria, estado);

			if (!mensaje) {
				return res.status(500).json({ error: 'Respuesta inesperada del SP.' });
			}

			if (mensaje.includes('inválido') || mensaje.includes('Use A o I')) {
				return res.status(400).json({ error: mensaje });
			}

			if (mensaje.includes('no encontrada')) {
				return res.status(404).json({ error: mensaje });
			}

			// ojo: el SP también puede responder "La categoría ya estaba en ese estado."
			// eso podría ser 200 igual (idempotente) o 409; lo dejo en 200 como venías haciendo.
			return res.status(200).json({ mensaje });
		} catch (error) {
			if (error?.errors) {
				return res.status(400).json({
					error: 'Datos inválidos en la petición.',
					issues: error.errors,
				});
			}

			console.error('Error cambiarEstadoCategoria:', error);
			return res.status(500).json({ error: error.message || 'Internal server error' });
		}
	}

	static async borraCategoria(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		const idCategoria = Number(req.params.id);

		if (!Number.isInteger(idCategoria) || idCategoria <= 0) {
			return res.status(400).json({ error: 'idCategoria inválido.' });
		}

		try {
			await Categoria.borraCategoria(idEmpresa, idCategoria);

			return res.status(200).json({ mensaje: 'Categoría eliminada exitosamente.' });
		} catch (error) {
			console.error('Error al eliminar categoría:', error?.message ?? error);

			const sqlState = error?.sqlState ?? error?.sqlstate;
			const msg =
				typeof error?.sqlMessage === 'string'
					? error.sqlMessage
					: typeof error?.message === 'string'
						? error.message
						: 'No se pudo borrar la categoría.';

			if (sqlState === '45000') {
				return res.status(409).json({ error: msg });
			}

			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async dameVacante(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		const nombreCategoria = String(req.params.categoria ?? '');
		const idVacante = Number.parseInt(String(req.params.idVacante), 10);

		if (!Number.isFinite(idVacante)) {
			return res.status(400).json({ error: 'idVacante inválido.' });
		}

		try {
			const row = await Vacante.dameVacante(idEmpresa, nombreCategoria, idVacante, null, null);

			if (!row) {
				return res.status(404).json({ error: 'No se pudo encontrar la vacante.' });
			}

			const vacante = {
				id: row.idVacante,
				idCategoria: row.idCategoria,
				categoria: row.categoria,
				vacante: row.vacante,
				descripcion: row.descripcion,
				tipoTrabajo: row.tipoTrabajo,
				modalidad: row.modalidad,
				fechaCreacion: row.fechaCreacion,
				fechaPublicacion: row.fechaPublicacion,
				fechaCierre: row.fechaCierre,
				localidad: row.localidad,
				nivelExperiencia: row.nivelExperiencia,
				habilidades: row.habilidades,
				estado: row.estado,
			};

			return res.status(200).json(vacante);
		} catch (error) {
			console.error('Error al obtener vacante:', error?.message ?? error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameVacanteAdmin(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		const idVacante = Number.parseInt(String(req.params.id), 10);
		if (!Number.isInteger(idVacante) || idVacante <= 0) {
			return res.status(400).json({ error: 'El id de la vacante es inválido.' });
		}

		try {
			const vacante = await Vacante.dameVacanteAdmin(idEmpresa, idVacante);

			return res.status(200).json(vacante);
		} catch (error) {
			if (String(error?.message ?? '') === 'VACANTE_NO_ENCONTRADA') {
				return res.status(404).json({ error: 'Vacante no encontrada.' });
			}

			console.error('Error al obtener vacante:', error?.message ?? error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameVacantesAvanzado(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		try {
			const { categoria, offset, pageSize, sortField, sortDir } = VacanteSchema.dameVacantes.parse(
				req.query,
			);

			const { items, itemCount } = await Vacante.dameVacantesAvanzado(idEmpresa, {
				categoria,
				offset,
				limit: pageSize,
				sortField,
				sortDir,
			});

			return res.status(200).json({ items, itemCount });
		} catch (error) {
			console.error('Error al obtener vacantes (admin):', error?.message ?? error);

			if (error?.issues) {
				return res.status(400).json({ error: 'Parámetros inválidos.', issues: error.issues });
			}

			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async altaVacante(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		try {
			const parsed = VacanteSchema.altaVacante.parse(req.body);

			const vacanteCreada = await Vacante.altaVacante(idEmpresa, parsed);

			return res.status(201).json(vacanteCreada);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ error: 'Validación fallida', issues: error.issues });
			}

			// SP SIGNAL
			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				switch (error.message) {
					case 'CATEGORIA_NO_EXISTE':
						return res.status(404).json({ error: 'La categoría no existe.' });

					case 'VACANTE_NO_ENCONTRADA':
						return res.status(404).json({ error: 'Vacante no encontrada.' });

					case 'ESTADO_INVALIDO':
					case 'TRANSICION_ESTADO_NO_PERMITIDA':
						return res.status(409).json({ error: error.message });

					default:
						return res.status(400).json({ error: error.message });
				}
			}

			console.error('Error al registrar vacante:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async modificaVacante(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		const id = Number.parseInt(String(req.params.id), 10);
		if (!Number.isInteger(id) || id <= 0) {
			return res.status(400).json({ error: 'idVacante inválido.' });
		}

		const estadoQuery = req.query.estado;

		try {
			const body = req.body || {};

			const {
				categoria,
				vacante,
				descripcion,
				tipoTrabajo,
				modalidad,
				localidad,
				nivelExperiencia,
				habilidades,
				estado, // body
			} = body;

			const estadoRaw =
				typeof estadoQuery === 'string' ? estadoQuery : typeof estado === 'string' ? estado : null;

			const estadoUpper = typeof estadoRaw === 'string' ? estadoRaw.toUpperCase() : null;

			const estadoParam = estadoUpper === 'B' ? null : estadoUpper; // null | 'P' | 'C' | (otro => SP lo rechaza)

			const vacanteModificada = await Vacante.modificaVacante(idEmpresa, id, {
				categoria: categoria ?? null, // NULL => no mover
				vacante: vacante ?? null,
				descripcion: descripcion ?? null,
				tipoTrabajo: tipoTrabajo ?? null,
				modalidad: modalidad ?? null,
				localidad: localidad ?? null,
				nivelExperiencia: nivelExperiencia ?? null,
				habilidades: habilidades ?? null, // crudo
				estado: estadoParam ?? null, // NULL => no tocar
			});

			return res.status(200).json(vacanteModificada);
		} catch (error) {
			const msg = String(error?.message ?? '');

			// Errores del SP (SIGNAL SQLSTATE '45000' ...)
			if (msg === 'VACANTE_NO_ENCONTRADA') {
				return res.status(404).json({ error: 'No se pudo encontrar la vacante.' });
			}

			if (msg === 'CATEGORIA_NO_EXISTE') {
				return res.status(409).json({ error: 'La categoría destino no existe.' });
			}

			if (msg === 'ESTADO_INVALIDO') {
				return res.status(400).json({ error: 'Estado inválido (solo P o C).' });
			}

			if (msg === 'TRANSICION_ESTADO_NO_PERMITIDA') {
				return res.status(409).json({ error: 'Transición de estado no permitida.' });
			}

			if (typeof ZodError !== 'undefined' && error instanceof ZodError) {
				return res.status(400).json({ error: 'Validación fallida', issues: error.issues });
			}

			console.error('Error en modificaVacante:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async borraVacante(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		try {
			await Vacante.borraVacante(idEmpresa, req.params.id);

			return res.status(200).json({ mensaje: 'Vacante eliminada exitosamente.' });
		} catch (err) {
			console.error('Error al eliminar vacante:', err?.message);
			if (err?.stack) console.error(err.stack);

			const sqlState = err?.sqlState ?? err?.sqlstate;
			const msg =
				typeof err?.sqlMessage === 'string'
					? err.sqlMessage
					: typeof err?.message === 'string'
						? err.message
						: 'Error al eliminar vacante.';

			if (sqlState === '45000') {
				return res.status(409).json({ error: msg });
			}

			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async damePostulantes(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		try {
			const postulantes = await Postulante.damePostulantes(idEmpresa);
			return res.status(200).json(postulantes);
		} catch (error) {
			console.error('Error al obtener postulantes:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameCurriculumPostulacion(req, res) {
		const idEmpresa = AdminController.getIdEmpresa(req, res);
		if (!idEmpresa) return;

		const idPostulacion = Number(req.params.idPostulacion);
		if (!Number.isInteger(idPostulacion) || idPostulacion <= 0) {
			return res.status(400).json({ error: 'ID de postulación inválido.' });
		}

		try {
			const row = await Curriculum.dameCurriculumPorPostulacion(idEmpresa, idPostulacion);

			const pdfBuffer = row.pdf;
			const filename = (row.nombre || `CV-postulacion-${idPostulacion}.pdf`).replace(/"/g, '');

			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
			res.setHeader('Content-Length', pdfBuffer.length);
			res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, Content-Length');

			return res.status(200).send(pdfBuffer);
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				if (msg.includes('CURRICULUM_NO_EXISTE')) {
					return res
						.status(404)
						.json({ error: 'No se encontró el currículum para esa postulación.' });
				}
				return res.status(400).json({ error: msg || 'Solicitud inválida.' });
			}

			console.error('Error al obtener currículum por postulación:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async damePostulacionesPorPostulante(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const idPostulante = String(req.params.idPostulante || '');
			if (!idPostulante) {
				return res.status(400).json({ error: 'idPostulante inválido' });
			}

			const rows = await Postulacion.damePostulaciones({
				por: 'postulante',
				idEmpresa,
				idPostulante,
			});

			return res.status(200).json(rows);
		} catch (error) {
			console.error('Error al obtener postulaciones por postulante:', error);

			if (error?.message === 'FILTRO_INVALIDO_POSTULACIONES') {
				return res.status(400).json({ error: 'Filtro inválido' });
			}

			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async damePostulacionesPorVacante(req, res) {
		try {
			const idEmpresa = AdminController.getIdEmpresa(req, res);
			if (!idEmpresa) return;

			const idVacante = Number.parseInt(String(req.params.idVacante), 10);
			if (!Number.isFinite(idVacante)) {
				return res.status(400).json({ error: 'idVacante inválido' });
			}

			const rows = await Postulacion.damePostulaciones({
				por: 'vacante',
				idEmpresa,
				idVacante,
			});

			return res.status(200).json(rows);
		} catch (error) {
			console.error('Error al obtener postulaciones por vacante:', error);

			if (error?.message === 'FILTRO_INVALIDO_POSTULACIONES') {
				return res.status(400).json({ error: 'Filtro inválido' });
			}

			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}
}
