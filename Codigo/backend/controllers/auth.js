import Administrador from '../models/administradores.js';

export default class AuthController {
	static async loginAdmin(req, res) {
		const { email, password } = req.body ?? {};
		if (!email || !password) {
			return res.status(400).json({ message: 'Faltan credenciales' });
		}

		const result = await Administrador.loginAdmin(email, password);

		if (!result) {
			return res.status(401).json({ message: 'Credenciales inválidas' });
		}

		return res.json(result);
	}

	static async me(req, res) {
		if (!req.user) {
			return res.status(401).json({ message: 'No autenticado' });
		}

		const { idAdmin, idEmpresa, email, rol } = req.user;

		return res.json({
			usuario: {
				id: idAdmin,
				idEmpresa: idEmpresa ?? null,
				email,
				rol,
			},
		});
	}
}
