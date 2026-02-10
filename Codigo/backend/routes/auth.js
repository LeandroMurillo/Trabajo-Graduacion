import express from 'express';
import { verifyJWT } from '../middlewares/auth.js';
import AuthController from '../controllers/auth.js';

export const authRoutes = express.Router();

authRoutes.post('/login', AuthController.loginAdmin);
authRoutes.get('/me', verifyJWT, AuthController.me);
