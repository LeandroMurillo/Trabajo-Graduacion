import express from 'express';
import AdminController from '../controllers/admin.js';

export const adminRoutes = express.Router();

adminRoutes.get('/categorias', AdminController.dameCategorias);
adminRoutes.get('/categorias/:id', AdminController.dameCategoria);
adminRoutes.post('/categorias', AdminController.altaCategoria);
adminRoutes.put('/categorias/:id', AdminController.modificaCategoria);
adminRoutes.patch('/categorias/:id/estado', AdminController.cambiarEstadoCategoria);
adminRoutes.delete('/categorias/:id', AdminController.borraCategoria);

adminRoutes.get('/categorias/:categoria/vacantes/:idVacante', AdminController.dameVacante);
adminRoutes.get('/vacantes', AdminController.dameVacantesAvanzado);
adminRoutes.post('/vacantes', AdminController.altaVacante);
adminRoutes.get('/vacantes/:id', AdminController.dameVacanteAdmin);
adminRoutes.put('/vacantes/:id', AdminController.modificaVacante);
adminRoutes.delete('/vacantes/:id', AdminController.borraVacante);

adminRoutes.get('/postulaciones/:idPostulacion/curriculum', AdminController.dameCurriculumPostulacion);
adminRoutes.get('/postulantes', AdminController.damePostulantes);
adminRoutes.get('/vacantes/:idVacante/postulaciones', AdminController.damePostulacionesPorVacante);
adminRoutes.get(
	'/postulantes/:idPostulante/postulaciones',
	AdminController.damePostulacionesPorPostulante,
);

adminRoutes.get('/estilos', AdminController.dameEstiloEmpresa);
adminRoutes.put('/estilos', AdminController.modificaEstiloEmpresa);
