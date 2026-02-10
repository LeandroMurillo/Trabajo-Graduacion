import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config.js';

export function verifyJWT(req, res, next) {
	const auth = req.headers.authorization || '';
	const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
	if (!token) return res.status(401).json({ message: 'No autenticado 1' });

	try {
		const payload = jwt.verify(token, JWT_SECRET);
		// Esperado del payload: { idAdmin, idEmpresa, rol, email }
		req.user = payload;
		return next();
	} catch {
		return res.status(401).json({ message: 'Token inválido' });
	}
}
