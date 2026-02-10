export function requireAuth(req, res, next) {
	if (!req.user) {
		return res.status(401).json({ message: 'No autenticado' });
	}
	next();
}

export function requireSuperadmin(req, res, next) {
	if (!req.user) {
		return res.status(401).json({ message: 'No autenticado' });
	}

	if (req.user.rol !== 'SUPERADMIN') {
		return res.status(403).json({ message: 'Requiere SUPERADMIN' });
	}

	next();
}

export function requireAdminEmpresa(req, res, next) {
	if (!req.user) {
		return res.status(401).json({ message: 'No autenticado' });
	}

	const { rol, idEmpresa: idEmpresaToken } = req.user;

	const idEmpresaRuta = req.idEmpresa;

	if (!idEmpresaRuta) {
		return res.status(400).json({ message: 'No se pudo resolver la empresa desde la URL' });
	}

	if (rol !== 'ADMIN') {
		return res.status(403).json({ message: 'Requiere ADMIN' });
	}

	if (Number(idEmpresaToken) !== Number(idEmpresaRuta)) {
		return res.status(404).json({ message: 'Recurso no encontrado' });
	}

	req.empresa = { idEmpresa: Number(idEmpresaRuta) };

	return next();
}
