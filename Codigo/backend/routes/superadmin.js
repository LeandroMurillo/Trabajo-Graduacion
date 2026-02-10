import express from 'express';
import SuperadminController from '../controllers/superadmin.js';

export const superadminRoutes = express.Router();

superadminRoutes.get('/empresas', SuperadminController.dameEmpresas);
superadminRoutes.get('/empresas/:id', SuperadminController.dameEmpresa);
superadminRoutes.post('/empresas', SuperadminController.altaEmpresa);
superadminRoutes.put('/empresas/:id', SuperadminController.modificaEmpresa);
superadminRoutes.patch('/empresas/:id/estado', SuperadminController.cambiarEstadoEmpresa);
superadminRoutes.delete('/empresas/:id', SuperadminController.borraEmpresa);

superadminRoutes.get('/administradores', SuperadminController.dameAdministradores);
superadminRoutes.get('/administradores/:id', SuperadminController.dameAdministrador);
superadminRoutes.post('/administradores', SuperadminController.altaAdministrador);
superadminRoutes.put('/administradores/:id', SuperadminController.modificaAdministrador);
superadminRoutes.delete('/administradores/:id', SuperadminController.borraAdministrador);

superadminRoutes.get('/cuotas', SuperadminController.listarCuotas);
