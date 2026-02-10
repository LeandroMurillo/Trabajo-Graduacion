import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { EmpresaSchema } from '../schemas/empresaSchema.js';
import AdministradorSchema from '../schemas/administradorSchema.js';

import Empresa from '../models/empresas.js';
import Administrador from '../models/administradores.js';
import Cuota from '../models/cuotas.js';

export default class SuperadminController {
	static async dameEmpresas(req, res) {
		try {
			const empresas = await Empresa.dameEmpresas();
			return res.status(200).json(empresas);
		} catch (error) {
			console.error('Error al obtener empresas:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameEmpresa(req, res) {
		try {
			const idEmpresa = Number(req.params.id);
			const empresa = await Empresa.dameEmpresa(idEmpresa);
			return res.status(200).json(empresa);
		} catch (error) {
			if (error && error.name === 'NOT_FOUND') {
				return res.status(404).json({ error: 'Empresa no encontrada.' });
			}
			console.error('Error al obtener empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async altaEmpresa(req, res) {
		let url = '';

		try {
			const data = EmpresaSchema.parse(req.body);
			url = data.url;

			const empresaCreada = await Empresa.altaEmpresa(data);

			return res.status(201).json(empresaCreada);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					error: 'Datos inválidos.',
					issues: error.issues,
				});
			}

			if (error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)) {
				return res.status(409).json({
					error: `El slug "${url}" ya está en uso.`,
				});
			}

			console.error('Error al crear empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async modificaEmpresa(req, res) {
		let url = '';

		try {
			const idEmpresa = Number(req.params.id);
			const data = EmpresaSchema.parse(req.body);
			url = data.url;

			const empresa = await Empresa.modificaEmpresa(idEmpresa, data);

			return res.status(200).json(empresa);
		} catch (error) {
			if (error instanceof ZodError) {
				return res.status(400).json({
					error: 'Datos inválidos.',
					issues: error.issues,
				});
			}

			if (error && (error.code === 'ER_DUP_ENTRY' || error.errno === 1062)) {
				return res.status(409).json({
					error: `El slug "${url}" ya está en uso.`,
				});
			}

			if (error && error.name === 'NOT_FOUND') {
				return res.status(404).json({ error: 'Empresa no encontrada.' });
			}

			console.error('Error al modificar empresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async cambiarEstadoEmpresa(req, res) {
		try {
			const idEmpresa = Number(req.params.id);
			const { estado } = req.body;

			if (!Number.isInteger(idEmpresa) || idEmpresa <= 0) {
				return res.status(400).json({ error: 'idEmpresa inválido.' });
			}

			const resultado = await Empresa.cambiarEstadoEmpresa(idEmpresa, estado);

			if (!resultado) {
				return res.status(500).json({ error: 'Respuesta inválida del SP.' });
			}

			if (resultado.mensaje === 'OK') {
				return res.status(200).json({ message: 'Estado actualizado.' });
			}

			return res.status(400).json({ error: resultado.mensaje });
		} catch (error) {
			console.error('AdminController.cambiarEstadoEmpresa:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async borraEmpresa(req, res) {
		try {
			const id = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({
					error: 'El id de empresa es inválido.',
				});
			}

			await Empresa.borraEmpresa(id);

			return res.sendStatus(204);
		} catch (err) {
			const msg = (err && (err.sqlMessage || err.message)) || '';

			switch (msg) {
				case 'EMPRESA_NO_ENCONTRADA':
					return res.status(404).json({
						error: 'No se encontró la empresa.',
					});

				case 'EMPRESA_SISTEMA_NO_BORRABLE':
					return res.status(409).json({
						error: 'No se puede borrar la empresa del sistema.',
					});

				case 'EMPRESA_DEBE_ESTAR_INACTIVA':
					return res.status(409).json({
						error: 'La empresa está activa, debe inactivar la empresa para borrarla.',
					});

				case 'EMPRESA_TIENE_CATEGORIAS':
					return res.status(409).json({
						error: 'La empresa tiene categorías asociadas.',
					});

				case 'EMPRESA_TIENE_CUOTAS':
					return res.status(409).json({
						error: 'La empresa tiene cuotas asociadas.',
					});

				case 'EMPRESA_TIENE_ADMINISTRADORES':
					return res.status(409).json({
						error: 'La empresa tiene administradores asociados.',
					});

				default:
					return res.status(500).json({
						error: 'Ocurrió un error inesperado al intentar borrar la empresa.',
					});
			}
		}
	}

	static async dameAdministradores(req, res) {
		try {
			const administradores = await Administrador.dameAdministradores();
			return res.status(200).json(administradores);
		} catch (error) {
			console.error('Error al obtener administradores:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async dameAdministrador(req, res) {
		try {
			const id = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({ error: 'Parámetros inválidos.' });
			}

			const admin = await Administrador.dameAdministrador(id);
			return res.status(200).json(admin);
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (msg.includes('ADMIN_NO_EXISTE')) {
				return res.status(404).json({ error: 'No se encontró el administrador.' });
			}

			console.error('Error al obtener administrador:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}

	static async altaAdministrador(req, res) {
		try {
			const { email, empresa, clave } = AdministradorSchema.altaAdministrador.parse(req.body);

			const emailNorm = String(email ?? '')
				.trim()
				.toLowerCase();
			const empresaNorm = String(empresa ?? '').trim();

			const claveHash = await bcrypt.hash(String(clave), 10);

			const creado = await Administrador.altaAdministrador({
				email: emailNorm,
				empresa: empresaNorm,
				claveHash,
			});

			return res.status(201).json(creado);
		} catch (error) {
			if (error?.issues) {
				return res.status(400).json({
					message: 'DATOS_INVALIDOS',
					issues: error.issues,
				});
			}

			const sqlState = error?.sqlState || error?.sqlstate;
			const errno = error?.errno;
			const code = String(error?.message ?? '');

			if (sqlState === '23000' || errno === 1062 || code === 'EMAIL_DUPLICADO') {
				return res.status(409).json({ error: 'Ya existe un administrador con ese correo.' });
			}

			if (sqlState === '45000') {
				switch (code) {
					case 'EMPRESA_INEXISTENTE':
						return res.status(400).json({ error: 'La empresa seleccionada no existe.' });
					case 'EMPRESA_INACTIVA':
						return res.status(409).json({ error: 'La empresa seleccionada está inactiva.' });
					default:
						return res.status(400).json({ error: 'No se pudo crear el administrador.' });
				}
			}

			console.error('Error al crear administrador:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async modificaAdministrador(req, res) {
		try {
			const id = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({ message: 'ID_INVALIDO' });
			}

			const parsed = AdministradorSchema.modificaAdministrador.safeParse(req.body);
			if (!parsed.success) {
				const first = parsed.error.issues[0];
				return res.status(400).json({ message: first?.message ?? 'DATOS_INVALIDOS' });
			}

			const { email, empresa, clave } = parsed.data;

			const emailNorm = typeof email === 'string' ? String(email).trim().toLowerCase() : null;
			const empresaNorm = typeof empresa === 'string' ? String(empresa).trim() : null;

			let claveHash = null;
			if (typeof clave === 'string' && clave.trim()) {
				claveHash = await bcrypt.hash(String(clave).trim(), 10);
			}

			const data = {
				email: emailNorm,
				empresa: empresaNorm,
				claveHash,
			};

			const row = await Administrador.modificaAdministrador(id, data);
			return res.status(200).json(row);
		} catch (error) {
			const msg = String(error?.message ?? '');

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				switch (msg) {
					case 'SIN_CAMBIOS':
						return res.status(400).json({ error: 'SIN_CAMBIOS' });

					case 'ADMIN_NO_EXISTE':
						return res.status(404).json({ error: 'ADMIN_NO_EXISTE' });

					case 'EMPRESA_INEXISTENTE':
						return res.status(400).json({ error: 'La empresa seleccionada no existe.' });

					case 'EMPRESA_INACTIVA':
						return res.status(409).json({ error: 'La empresa seleccionada está inactiva.' });

					default:
						return res.status(400).json({ error: msg || 'ERROR_VALIDACION' });
				}
			}

			if (error?.code === 'ER_DUP_ENTRY' || error?.errno === 1062) {
				return res.status(409).json({ error: 'El correo ya pertenece a otro administrador.' });
			}

			console.error('modificaAdministrador:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async borraAdministrador(req, res) {
		try {
			const id = Number(req.params.id);

			if (!Number.isInteger(id) || id <= 0) {
				return res.status(400).json({ error: 'Parámetros inválidos.' });
			}

			await Administrador.borraAdministrador(id);
			return res.sendStatus(204);
		} catch (error) {
			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				switch (error.message) {
					case 'ADMIN_NO_EXISTE':
						return res.status(404).json({ error: 'No se encontró el administrador.' });
					case 'SUPERADMIN_NO_BORRABLE':
					case 'ADMIN_EMPRESA_SISTEMA_NO_BORRABLE':
						return res.status(409).json({ error: 'No se pudo borrar el administrador.' });
					default:
						return res.status(400).json({ error: 'No se pudo borrar el administrador.' });
				}
			}

			console.error('Error al eliminar administrador:', error);
			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async listarCuotas(req, res) {
		try {
			const idEmpresa =
				req.query.idEmpresa === undefined ||
				req.query.idEmpresa === null ||
				req.query.idEmpresa === ''
					? null
					: Number.parseInt(String(req.query.idEmpresa), 10);

			if (idEmpresa !== null && !Number.isFinite(idEmpresa)) {
				return res.status(400).json({ error: 'idEmpresa inválido.' });
			}

			const page = Math.max(1, Number.parseInt(String(req.query.page ?? '1'), 10) || 1);
			const pageSize = Math.min(
				200,
				Math.max(1, Number.parseInt(String(req.query.pageSize ?? '25'), 10) || 25),
			);

			const sortDirRaw = String(req.query.sortDir ?? 'desc').toLowerCase();
			const sortDir = sortDirRaw === 'asc' ? 'asc' : 'desc';

			const sortByRaw = req.query.sortBy ? String(req.query.sortBy) : null;
			const sortByMap = {
				id: 'idCuota',
				idCuota: 'idCuota',
				idEmpresa: 'idEmpresa',
				empresa: 'empresa',
				monto: 'monto',
				fechaPago: 'fechaPago',
			};

			const sortBy = sortByRaw ? (sortByMap[sortByRaw] ?? null) : null;

			const items = await Cuota.dameCuotas(idEmpresa, page, pageSize, sortBy, sortDir);

			// Opción B: itemCount = cantidad de items en esta página
			const itemCount = items.length;

			// opcional: normalizar monto a number
			const normalizedItems = items.map((it) => ({
				...it,
				monto: typeof it.monto === 'string' ? Number(it.monto) : it.monto,
			}));

			return res.status(200).json({ items: normalizedItems, itemCount });
		} catch (error) {
			console.error('Error al obtener cuotas:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}
}
