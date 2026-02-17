import bcrypt from 'bcryptjs';
import { ZodError } from 'zod';

import { EmpresaSchema, cambiarEstadoEmpresaSchema } from '../schemas/empresaSchema.js';
import AdministradorSchema from '../schemas/administradorSchema.js';
import { FiltroSchema } from '../schemas/filtroSchema.js';

import Empresa from '../models/empresas.js';
import Administrador from '../models/administradores.js';
import Cuota from '../models/cuotas.js';

export default class SuperadminController {
	static async dameEmpresas(req, res) {
		try {
			const soloActivas = String(req.query.soloActivas ?? 'false') === 'true';
			const empresas = await Empresa.dameEmpresas(soloActivas);
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
			const parsed = cambiarEstadoEmpresaSchema.parse({
				id: req.params.id,
				estado: req.body?.estado,
			});

			await Empresa.cambiarEstadoEmpresa(parsed.id, parsed.estado);

			return res.sendStatus(204);
		} catch (error) {
			if (error?.issues) {
				return res.status(400).json({
					error: 'Datos inválidos.',
					issues: error.issues,
				});
			}

			if (error?.sqlState === '45000' || error?.code === 'ER_SIGNAL_EXCEPTION') {
				switch (error.message) {
					case 'EMPRESA_ID_INVALIDA':
						return res.status(400).json({ error: 'idEmpresa inválido.' });

					case 'EMPRESA_NO_EXISTE':
						return res.status(404).json({ error: 'No se encontró la empresa.' });

					case 'EMPRESA_SISTEMA_NO_MODIFICABLE':
						return res
							.status(409)
							.json({ error: 'No se permite modificar la empresa del sistema.' });

					case 'EMPRESA_YA_EN_ESE_ESTADO':
						return res.status(409).json({ error: 'La empresa ya estaba en ese estado.' });

					default:
						return res.status(400).json({ error: 'Operación inválida.' });
				}
			}

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

			const claveHash = await bcrypt.hash(clave, 10);

			const creado = await Administrador.altaAdministrador({
				email,
				empresa,
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

			const sqlState = error?.sqlState;
			const errno = error?.errno;
			const code = error?.sqlMessage;

			if (errno === 1062 || (sqlState === '23000' && code === 'EMAIL_DUPLICADO')) {
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

			return res.status(500).json({ error: 'Error interno del servidor.' });
		}
	}

	static async modificaAdministrador(req, res) {
		try {
			const { id } = AdministradorSchema.adminIdParams.parse(req.params);
			const { email, empresa, clave } = AdministradorSchema.modificaAdministrador.parse(req.body);

			const claveHash = clave ? await bcrypt.hash(clave, 10) : null;

			const administradorModificado = await Administrador.modificaAdministrador(id, {
				email: email ?? null,
				empresa: empresa ?? null,
				claveHash,
			});

			return res.status(200).json(administradorModificado);
		} catch (error) {
			const msg = String(error?.message ?? '');

			console.log(error);

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

			if (error?.code === 'ER_DUP_ENTRY') {
				return res.status(409).json({ error: 'Ya existe un administrador con ese correo.' });
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

	static async dameCuotas(req, res) {
		try {
			const query = FiltroSchema.parse(req.query);

			const { items, itemCount } = await Cuota.dameCuotas(query);

			return res.status(200).json({ items, itemCount });
		} catch (error) {
			if (error?.name === 'ZodError') {
				console.log('filter recibido:', req.query.filter);
				return res.status(400).json({ error: 'Parámetros inválidos', issues: error.issues });
			}
			console.error('Error al obtener cuotas:', error);
			return res.status(500).json({ error: 'Error interno del servidor' });
		}
	}
}
