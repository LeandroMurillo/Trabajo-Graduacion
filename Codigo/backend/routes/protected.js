import express from 'express';

import ProtectedController from '../controllers/protected.js';

export const protectedRoutes = express.Router({ mergeParams: true });

protectedRoutes.use(ProtectedController.verifySessionCookie);
protectedRoutes.post('/logout', ProtectedController.logout);

protectedRoutes.get('/curriculums', ProtectedController.dameCurriculum);
protectedRoutes.post('/curriculums', ProtectedController.altaCurriculum);

protectedRoutes.get('/postulaciones', ProtectedController.dameMisPostulaciones);
protectedRoutes.post('/postulaciones', ProtectedController.altaPostulacion);
protectedRoutes.delete('/postulaciones/:id', ProtectedController.borraPostulacion);

protectedRoutes.get('/perfil', ProtectedController.damePostulante);
protectedRoutes.patch('/postulantes', ProtectedController.modificaPostulante);
