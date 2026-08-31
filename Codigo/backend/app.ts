import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fileUpload from 'express-fileupload';

import { APP_ORIGINS, PORT } from './config.js';
import { publicRoutes } from './routes/public.js';
import { authRoutes } from './routes/auth.js';
import { adminRoutes } from './routes/admin.js';
import { protectedRoutes } from './routes/protected.js';
import { superadminRoutes } from './routes/superadmin.js';

import { verifyJWT } from './middlewares/auth.js';
import {
	requireAuth,
	requireSuperadmin,
	requireAdminEmpresa,
} from './middlewares/gestionarRoles.js';

import {
	identificarEmpresaUsuarios,
	identificarEmpresaAdmin,
} from './middlewares/identificarEmpresa.js';

const app = express();
app.disable('x-powered-by');
app.set('trust proxy', 1);

// ===== CORS (antes que nada útil) =====
app.use(
	cors({
		origin(origin, callback) {
			if (!origin) return callback(null, true);
			if (APP_ORIGINS.includes(origin)) return callback(null, true);
			return callback(new Error('No autorizado por política CORS'));
		},
		credentials: true,
	}),
);

// ===== base middlewares =====
app.use(express.json());
app.use(cookieParser());
app.use(fileUpload({ hashAlgorithm: 'sha256' }));
app.use(express.urlencoded({ extended: false }));

app.get('/health', (_req, res) => {
	res.status(200).json({ status: 'ok' });
});

// ===== superadmin (plataforma, sin slug de empresa) =====
app.use('/superadmin', verifyJWT, requireSuperadmin, superadminRoutes);

// ===== auth global (sin slug) =====
app.use('/auth', authRoutes);

// ===== TENANT API: /:empresa/api/...
const tenantApi = express.Router({ mergeParams: true });
tenantApi.use(identificarEmpresaUsuarios);
tenantApi.use(publicRoutes);
tenantApi.use(protectedRoutes);
app.use('/:empresa/api', tenantApi);

// ===== admin de empresa: /:empresa/admin/... =====
app.use(
	'/:empresa/admin',
	identificarEmpresaAdmin,
	verifyJWT,
	requireAuth,
	requireAdminEmpresa,
	adminRoutes,
);

app.listen(PORT, () => {
	console.log(`API escuchando en puerto ${PORT}`);
});
