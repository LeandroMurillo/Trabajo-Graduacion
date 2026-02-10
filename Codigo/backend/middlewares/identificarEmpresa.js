import Empresa from '../models/empresas.js';

export async function identificarEmpresaUsuarios(req, res, next) {
	if (req.idEmpresa) return next();

	const slug = req.params.empresa;
	if (!slug) return res.status(400).json({ error: 'Empresa no especificada en la URL' });

	try {
		const empresa = await Empresa.dameEmpresaPorSlug(slug);

		if (empresa.estado !== 'A') {
			return res.status(404).json({ error: 'No se pudo acceder a la página' });
		}

		req.idEmpresa = empresa.idEmpresa;
		req.empresa = { idEmpresa: empresa.idEmpresa, estado: empresa.estado };

		return next();
	} catch (err) {
		const msg = String(err?.message ?? '');

		if (err?.name === 'NOT_FOUND' || msg.includes('EMPRESA_NO_ENCONTRADA')) {
			return res.status(404).json({ error: 'No se pudo acceder a la página' });
		}

		console.error(err);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
}

export async function identificarEmpresaAdmin(req, res, next) {
	if (req.idEmpresa) return next();

	const slug = req.params.empresa;
	if (!slug) return res.status(400).json({ error: 'Empresa no especificada en la URL' });

	try {
		const empresa = await Empresa.dameEmpresaPorSlug(slug);
		req.idEmpresa = empresa.idEmpresa;
		req.empresa = { idEmpresa: empresa.idEmpresa, estado: empresa.estado };

		return next();
	} catch (err) {
		const msg = String(err?.message ?? '');

		if (err?.name === 'NOT_FOUND' || msg.includes('EMPRESA_NO_ENCONTRADA')) {
			return res.status(404).json({ error: 'Empresa no encontrada' });
		}

		console.error(err);
		return res.status(500).json({ error: 'Error interno del servidor' });
	}
}
