import express from 'express';
import cookieParser from 'cookie-parser';
import { ZodError } from 'zod';
import Empresa from '../models/empresas.js';
import Postulante from '../models/postulantes.js';
import Categoria from '../models/categorias.js';
import Vacante from '../models/vacantes.js';
import { registrarPostulanteSchema, IdTokenSchema } from '../schemas/postulanteSchema.js';

import { loginConToken } from '../firebase/auth.js';

import { firebaseAdminAuth } from '../firebase/firebaseConfig.js';

const app = express();

app.use(cookieParser());

export default class PublicController {
	static async dameEstiloEmpresa(req, res) {
		const idEmpresa = req.idEmpresa ?? req.user?.idEmpresa;

		if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
			return res.status(400).json({ error: 'Empresa inválida.' });
		}

		try {
			const estilo = await Empresa.dameEstiloEmpresa(idEmpresa);

			if (estilo == null) {
				return res.status(404).json({ error: 'No se encontró el estilo de la empresa.' });
			}

			return res.status(200).json(estilo);
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.name === 'NOT_FOUND' || msg.includes('EMPRESA_NO_ENCONTRADA')) {
				return res.status(404).json({ error: 'No se encontró la empresa.' });
			}

			console.error('Error al obtener estilo empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameNombreEmpresa(req, res) {
		const idEmpresa = req.idEmpresa;

		if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
			return res.status(400).json({ error: 'Empresa inválida.' });
		}

		try {
			const empresa = await Empresa.dameNombreEmpresa(idEmpresa);
			return res.status(200).json({ empresa });
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.name === 'NOT_FOUND' || msg.includes('EMPRESA_NO_ENCONTRADA')) {
				return res.status(404).json({ error: 'No se encontró el nombre de la empresa.' });
			}

			console.error('Error al obtener nombre de la empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameLogoEmpresa(req, res) {
		const idEmpresa = req.idEmpresa;

		try {
			const [[{ logo }]] = await Empresa.dameLogoEmpresa(idEmpresa);

			// se guarda por defecto este encabezado pero podríamos guardar el Content-Type en la base de datos
			res.setHeader('Content-Type', 'image/png');

			return res.send(logo);
		} catch (error) {
			console.error('Error al obtener logo de la empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async dameFaviconEmpresa(req, res) {
		const idEmpresa = req.idEmpresa;

		try {
			const [[{ favicon }]] = await Empresa.dameFaviconEmpresa(idEmpresa);

			// se guarda por defecto este encabezado pero podríamos guardar el Content-Type en la base de datos
			res.setHeader('Content-Type', 'image/png');

			return res.send(favicon);
		} catch (error) {
			console.error('Error al obtener logo de la empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async dameCategorias(req, res) {
		const idEmpresa = req.idEmpresa;

		try {
			const rows = await Categoria.dameCategorias(idEmpresa, 'A');

			const categorias = rows.map(({ id, categoria }) => ({
				id,
				categoria,
			}));

			return res.status(200).json(categorias);
		} catch (error) {
			console.error('Error al obtener categorías:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameVacantes(req, res) {
		const idEmpresa = req.idEmpresa;
		let { titulo, categoria, offset, limit } = req.query;

		const categoriaStr = typeof categoria === 'string' ? categoria.trim() : null;
		const tituloStr = typeof titulo === 'string' ? titulo.trim() : null;

		const offsetNum = Number.parseInt(String(offset ?? ''), 10);
		const limitNum = Number.parseInt(String(limit ?? ''), 10);

		const safeOffset = Number.isFinite(offsetNum) && offsetNum >= 0 ? offsetNum : undefined;
		const safeLimit =
			Number.isFinite(limitNum) && limitNum > 0 && limitNum <= 100 ? limitNum : undefined;

		try {
			const { items, itemCount } = await Vacante.dameVacantes(idEmpresa, {
				categoria: categoriaStr,
				titulo: tituloStr,
				offset: safeOffset,
				limit: safeLimit,
			});

			return res.status(200).json({ items, itemCount });
		} catch (error) {
			console.error('Error al obtener vacantes para usuarios:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameVacantePostulante(req, res) {
		const idEmpresa = req.idEmpresa;

		const id = Number.parseInt(req.params.id);
		if (!Number.isFinite(id) || id <= 0) {
			return res.status(400).json({ error: 'id inválido.' });
		}

		try {
			const detalleVacante = await Vacante.dameVacantePostulante(idEmpresa, id);
			return res.status(200).json(detalleVacante);
		} catch (error) {
			if (error?.message === 'VACANTE_NO_ENCONTRADA') {
				return res.status(404).json({ error: 'Vacante no encontrada.' });
			}

			console.error('Error al obtener vacante para usuarios:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async altaPostulante(req, res) {
		let uidCreado = null;

		try {
			const { nombres, apellidos, genero, fechaNacimiento, idToken } =
				registrarPostulanteSchema.parse(req.body);

			const decoded = await firebaseAdminAuth.verifyIdToken(String(idToken), true);

			const uid = String(decoded.uid || decoded.sub || '').trim();
			const email = typeof decoded.email === 'string' ? decoded.email.trim().toLowerCase() : '';
			const emailVerificado = decoded.email_verified === true;

			if (!uid) {
				return res.status(400).json({ error: 'Token inválido: UID no disponible.' });
			}

			if (!email) {
				return res.status(400).json({ error: 'Token inválido: email no disponible.' });
			}

			uidCreado = uid;

			const mensaje = await Postulante.altaPostulante({
				id: uid,
				nombres,
				apellidos,
				email,
				genero,
				fechaNacimiento,
			});

			if (mensaje !== 'OK') {
				try {
					await firebaseAdminAuth.deleteUser(uidCreado);
				} catch (e) {
					console.error('No se pudo revertir el usuario en Firebase:', e);
				}

				return res.status(400).json({ error: mensaje });
			}

			return res.status(201).json({
				message: 'Usuario registrado exitosamente. Revise su correo para verificar la cuenta.',
				emailVerificado,
			});
		} catch (error) {
			if (uidCreado) {
				try {
					await firebaseAdminAuth.deleteUser(uidCreado);
				} catch (e) {
					console.error('No se pudo revertir el usuario en Firebase:', e);
				}
			}

			if (error instanceof ZodError) {
				return res.status(400).json({
					error: 'Datos inválidos en la petición.',
					issues: error.issues,
				});
			}

			if (typeof error?.code === 'string' && error.code.startsWith('auth/')) {
				return res.status(401).json({
					error: 'Token de autenticación inválido o expirado.',
					code: error.code,
				});
			}

			console.error('Error al registrar usuario:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async login(req, res) {
		try {
			const idToken = IdTokenSchema.parse(req.body.idToken);

			const { sessionCookie, options } = await loginConToken(idToken);

			res.cookie('session', sessionCookie, options);
			return res.status(200).json({ status: 'success' });
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({ error: 'Body inválido.', issues: error.issues });
			}

			const code = String(error?.code ?? error?.message ?? '');

			if (code === 'POSTULANTE_INACTIVO') {
				return res.status(403).json({
					error:
						'Su cuenta ha sido suspendida temporalmente por incumplir con las normas de nuestra plataforma.',
				});
			}

			if (code === 'POSTULANTE_NO_EXISTE') {
				return res.status(404).json({ error: 'No se encontró el usuario.' });
			}

			if (code === 'EMAIL_NO_VERIFICADO') {
				return res.status(403).json({
					error: 'Debe verificar su correo electrónico antes de iniciar sesión.',
				});
			}

			if (code === 'NO_SE_PUDO_ACTIVAR_POSTULANTE') {
				return res.status(409).json({
					error: 'No se pudo activar la cuenta. Intente nuevamente.',
				});
			}

			if (String(error?.code ?? '').startsWith('auth/')) {
				return res.status(401).json({ error: 'Token inválido o expirado.' });
			}

			console.error('Error during login:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}
}
