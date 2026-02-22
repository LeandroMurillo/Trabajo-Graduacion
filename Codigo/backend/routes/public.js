import express from 'express';

import PublicController from '../controllers/public.js';
import ProtectedController from '../controllers/protected.js';

export const publicRoutes = express.Router({ mergeParams: true });

publicRoutes.get('/session', ProtectedController.restoreSession);

publicRoutes.get('/estilo', PublicController.dameEstiloEmpresa);

publicRoutes.get('/nombreEmpresa', PublicController.dameNombreEmpresa);

publicRoutes.get('/categorias', PublicController.dameCategorias);

publicRoutes.get('/vacantes', PublicController.dameVacantes);

publicRoutes.get('/vacantes/:id', PublicController.dameVacantePostulante);

publicRoutes.post('/registro', PublicController.altaPostulante);

publicRoutes.post('/login', PublicController.login);
