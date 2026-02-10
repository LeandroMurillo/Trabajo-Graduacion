import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import { createBrowserRouter, RouterProvider } from 'react-router';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import App from './App';
import Layout from './Layout';

import CredentialsSignInPage from './pages/paginaLogin';
import DashboardPage from './pages';
import NotFound from './pages/notFound';
import paginaPostulaciones from './pages/paginaPostulaciones';
import paginaPerfilPostulante from './pages/paginaPerfilPostulante';
import Registro from './pages/registro';
import RestablecerContraseña from './pages/RestablecerContraseña';
import PaginaVacante from './pages/paginaVacante';

const queryClient = new QueryClient();

const router = createBrowserRouter([
	{
		Component: App,
		errorElement: <NotFound />,
		children: [
			{
				path: '/:empresa',
				Component: Layout,
				handle: { title: 'Inicio' },
				children: [
					{
						index: true,
						Component: DashboardPage,
						handle: { title: 'Inicio' },
					},
					{
						path: 'postulaciones',
						Component: paginaPostulaciones,
						handle: { title: 'Mis postulaciones' },
					},
					{
						path: 'perfil-postulante',
						Component: paginaPerfilPostulante,
						handle: { title: 'Mi perfil' },
					},
					{
						path: ':pCategoria/:pIdVacante/:pTitulo',
						Component: PaginaVacante,
						handle: {
							title: (match: { params: { pTitulo?: string } }) => {
								const raw = String(match.params?.pTitulo ?? 'Vacante');
								const pretty = decodeURIComponent(raw).replace(/[-_]+/g, ' ');
								return pretty;
							},
						},
					},
					{
						path: 'login',
						Component: CredentialsSignInPage,
						handle: { title: 'Iniciar sesión' },
					},
					{
						path: 'signup',
						Component: Registro,
						handle: { title: 'Crear cuenta' },
					},
					{
						path: 'forgot-password',
						Component: RestablecerContraseña,
						handle: { title: 'Restablecer contraseña' },
					},
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<QueryClientProvider client={queryClient}>
			<RouterProvider router={router} />
		</QueryClientProvider>
	</React.StrictMode>,
);
