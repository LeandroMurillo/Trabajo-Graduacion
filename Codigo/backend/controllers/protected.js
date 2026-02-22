import { z, ZodError } from 'zod';
import { firebaseAdminAuth } from '../firebase/firebaseConfig.js';
import Curriculum from '../models/curriculums.js';
import Postulacion from '../models/postulaciones.js';
import CurriculumSchemas from '../schemas/curriculumSchema.js';
import PostulacionSchemas from '../schemas/postulacionSchema.js';
import { modificarDatosPerfilBodySchema } from '../schemas/postulanteSchema.js';

import Postulante from '../models/postulantes.js';
import { verificarCookieDeSession, revocarSesionPorCookie } from '../firebase/auth.js';

export default class ProtectedController {
	static async verifySessionCookie(req, res, next) {
		const sessionCookie = req.cookies.session || '';

		try {
			if (!sessionCookie) {
				return res.status(401).json({ error: 'No hay token de sesión.' });
			}

			const decoded = await verificarCookieDeSession(sessionCookie);

			const uidRaw = decoded?.user_id || decoded?.sub || decoded?.uid || null;
			const uid = uidRaw ? String(uidRaw) : null;

			if (!uid) {
				res.clearCookie('session', {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
				});
				return res.status(401).json({ error: 'Sesión inválida o expirada.' });
			}

			req.user = { ...decoded, uid };
			return next();
		} catch (error) {
			const code = String(error?.code ?? error?.message ?? '');

			res.clearCookie('session', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			});

			if (code === 'POSTULANTE_INACTIVO') {
				return res.status(403).json({ error: 'Cuenta inactiva.' });
			}

			if (code === 'POSTULANTE_PENDIENTE') {
				return res.status(403).json({ error: 'Cuenta pendiente de activación.' });
			}

			if (code.startsWith('auth/')) {
				return res.status(401).json({ error: 'Sesión inválida o expirada.' });
			}

			console.error('Error verifySessionCookie:', error);
			return res.status(403).json({ error: 'Acceso denegado.' });
		}
	}

	static async restoreSession(req, res) {
		const sessionCookie = req.cookies.session || '';

		try {
			if (!sessionCookie) {
				return res.status(200).json({ user: null });
			}

			const decoded = await verificarCookieDeSession(sessionCookie);

			const uidRaw = decoded?.user_id || decoded?.sub || decoded?.uid || null;
			const uid = uidRaw ? String(uidRaw) : null;

			if (!uid) {
				res.clearCookie('session', {
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
				});
				return res.status(200).json({ user: null });
			}

			const postulante = await Postulante.damePostulante(uid);

			const nombreCompleto = postulante
				? `${String(postulante.nombres ?? '').trim()} ${String(postulante.apellidos ?? '').trim()}`.trim()
				: '';

			return res.status(200).json({
				user: {
					email: decoded.email ?? postulante?.email ?? null,
					name: (nombreCompleto || decoded.name) ?? null,
					image: decoded.picture ?? null,
					uid,
				},
			});
		} catch (error) {
			res.clearCookie('session', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			});

			console.error('Error restoreSession:', error);
			return res.status(200).json({ user: null });
		}
	}

	static async damePostulante(req, res) {
		const idPostulante = req.user.uid;

		try {
			const postulante = await Postulante.damePostulante(idPostulante);

			if (!postulante) {
				return res.status(404).json({ error: 'Postulante no encontrado.' });
			}

			return res.status(200).json(postulante);
		} catch (error) {
			console.error('Error al obtener perfil:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async modificaPostulante(req, res) {
		try {
			const body = modificarDatosPerfilBodySchema.parse(req.body);
			const uid = String(req.user.uid);
			const parsed = { id: uid, ...body };

			const mensaje = await Postulante.modificaPostulante(parsed);

			if (mensaje !== 'OK') {
				return res.status(400).json({ error: mensaje });
			}

			try {
				const postulante = await Postulante.damePostulante(uid);

				if (postulante) {
					const displayName =
						`${String(postulante.nombres ?? '').trim()} ${String(postulante.apellidos ?? '').trim()}`.trim();

					if (displayName) {
						await firebaseAdminAuth.updateUser(uid, { displayName });
					}
				}
			} catch (firebaseError) {
				console.warn('No se pudo sincronizar displayName en Firebase:', firebaseError);
			}

			return res.status(200).json({
				message: 'Datos personales actualizados exitosamente.',
			});
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					error: 'Datos inválidos en la petición.',
					issues: error.issues,
				});
			}

			console.error('Error al actualizar los datos personales:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async dameCurriculum(req, res) {
		const idPostulante = req.user.uid;

		try {
			const row = await Curriculum.dameCurriculum(idPostulante);

			const buffer = row.pdf;
			const nombre = (row.nombre || 'curriculum.pdf').replace(/"/g, '');

			res.setHeader('Content-Type', 'application/pdf');
			res.setHeader('Content-Disposition', `inline; filename="${nombre}"`);
			res.setHeader('Content-Length', buffer.length);
			res.setHeader('Access-Control-Expose-Headers', 'Content-Disposition, ETag, Content-Length');

			return res.end(buffer);
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				switch (msg) {
					case 'CURRICULUM_NO_EXISTE':
						return res.status(404).json({ error: 'Currículum no encontrado.' });
					default:
						return res.status(400).json({ error: msg || 'Solicitud inválida.' });
				}
			}

			console.error('Error al obtener curriculum:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async altaCurriculum(req, res) {
		const idPostulante = req.user.uid;

		try {
			const { hash } = req.body || {};
			const upload = req.files?.curriculum;

			if (!upload) {
				return res.status(400).json({ error: 'Archivo currículum requerido.' });
			}

			const datosValidados = CurriculumSchemas.altaCurriculumSchema.parse({
				idPostulante,
				curriculum: {
					nombre: upload.name,
					mimetype: upload.mimetype,
					tamaño: upload.size,
					archivo: upload.data,
					hash,
				},
			});

			const mensaje = await Curriculum.altaCurriculum({
				idPostulante: datosValidados.idPostulante,
				nombre: datosValidados.curriculum.nombre,
				hash: datosValidados.curriculum.hash,
				archivo: datosValidados.curriculum.archivo,
			});

			if (mensaje !== 'OK') {
				return res.status(400).json({ error: mensaje });
			}

			return res.status(201).json({ message: 'Currículum agregado exitosamente.' });
		} catch (error) {
			if (error instanceof z.ZodError) {
				const firstIssue = error.issues[0];
				return res.status(400).json({
					error: firstIssue?.message || 'Datos inválidos en la petición.',
				});
			}

			const msg = String(error?.message ?? '');

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				return res.status(400).json({ error: msg || 'Solicitud inválida.' });
			}

			if (error?.code === 'ER_NO_REFERENCED_ROW_2') {
				return res.status(409).json({ error: 'Postulante inexistente.' });
			}

			console.error('Error al agregar curriculum:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async altaPostulacion(req, res) {
		const idEmpresa = req.idEmpresa;
		const idPostulante = req.user.uid;

		try {
			const { idVacante } = PostulacionSchemas.altaPostulacion.parse(req.body);

			const vacanteCreada = await Postulacion.altaPostulacion({
				idEmpresa,
				idVacante,
				idPostulante,
			});

			return res.status(201).json({
				message: 'Postulación realizada exitosamente.',
				estado: 'OK',
				vacanteCreada,
			});
		} catch (error) {
			console.error('Error al realizar postulación:', error);

			if (error?.issues) {
				return res.status(400).json({ error: 'DATOS_INVALIDOS', details: error.issues });
			}

			const msg = error?.sqlMessage || error?.message || '';
			if (String(msg).includes('NO_SE_PUDO_POSTULAR')) {
				return res.status(400).json({ error: 'NO_SE_PUDO_POSTULAR' });
			}

			if (error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062) {
				return res.status(200).json({
					message: 'Ya te habías postulado a esta vacante.',
					estado: 'OK_EXISTENTE',
				});
			}

			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async borraPostulacion(req, res) {
		const idEmpresa = req.idEmpresa;
		const idPostulante = req.user.uid;

		const idPostulacion = Number(req.params.id);
		if (!Number.isInteger(idPostulacion) || idPostulacion <= 0) {
			return res.status(400).json({ error: 'ID_POSTULACION_INVALIDO' });
		}

		try {
			await Postulacion.borraPostulacion({
				idEmpresa,
				idPostulacion,
				idPostulante,
			});

			return res.status(204).send();
		} catch (error) {
			console.error('Error al borrar postulación:', error);

			const msg = error?.sqlMessage || error?.message || '';

			if (String(msg).includes('POSTULACION_NO_EXISTE')) {
				return res.status(404).json({ error: 'POSTULACION_NO_EXISTE' });
			}

			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async dameMisPostulaciones(req, res) {
		const idEmpresa = req.idEmpresa;
		const idPostulante = req.user.uid;

		try {
			const postulaciones = await Postulacion.dameMisPostulaciones(idEmpresa, idPostulante);

			return res.status(200).json(postulaciones);
		} catch (error) {
			console.error('Error al obtener postulaciones:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async logout(req, res) {
		try {
			const sessionCookie = req.cookies.session || '';

			if (sessionCookie) {
				await revocarSesionPorCookie(sessionCookie);
			}

			res.clearCookie('session', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			});

			return res.json({ success: true });
		} catch (error) {
			console.error('Error en ProtectedController.logout:', error);

			res.clearCookie('session', {
				httpOnly: true,
				secure: process.env.NODE_ENV === 'production',
			});

			return res.status(500).json({ error: 'Error al cerrar sesión' });
		}
	}
}
