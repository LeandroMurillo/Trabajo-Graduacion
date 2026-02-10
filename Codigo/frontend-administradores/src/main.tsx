// main.tsx
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router';
import App from './App';
import Layout from './layouts/dashboard';

import SignIn from './pages/SignIn';

import CategoriaCrud from './pages/CategoriaCrud';

import VacanteList from './pages/vacantes/VacanteList';
import VacanteEdit from './pages/vacantes/VacanteEdit';
import VacanteCreate from './pages/vacantes/VacanteCreate';

import PostulacionCrud from './pages/PostulacionCrud';
import PostulanteList from './pages/PostulanteCrud';

import Estilos from './pages/Estilos/Estilos';

import CuotasList from './pages/CuotasList';

import { fromSlug } from './data/utils';
import EmpresaCrud from './pages/EmpresaCrud';
import AdminCrud from './pages/AdminCrud';

const router = createBrowserRouter([
	{
		Component: App,
		children: [
			// 👉 raíz "/" (trabajo.com:5173)
			// El contenido lo decide App.tsx (redirige según sesión / empresa)
			{ index: true, Component: () => <div /> },

			{ path: 'sign-in', Component: SignIn },

			// 👉 TODO el panel cuelga de /:empresa
			{
				path: ':empresa',
				Component: Layout,
				children: [
					// /:empresa  →  /:empresa/vacantes
					{ index: true, Component: () => <Navigate to='vacantes' replace /> },

					// --- Admin "normal" ---
					{ path: 'categorias', Component: CategoriaCrud },
					{ path: 'categorias/new', Component: CategoriaCrud },
					{ path: 'categorias/:id/edit', Component: CategoriaCrud },

					{
						path: 'categorias/:catSlug/vacantes/:vacId/:vacSlug/postulaciones',
						Component: PostulacionCrud,
					},
					{
						path: 'categorias/:slug/vacantes',
						Component: VacanteList,
						handle: {
							title: (params: Record<string, string>) =>
								`Vacantes de ${fromSlug(params.slug, 'lower')}`,
						},
					},
					{
						path: 'categorias/:slug/vacantes/new',
						Component: VacanteCreate,
						handle: {
							title: (params: Record<string, string>) =>
								`Nueva vacante en ${fromSlug(params.slug, 'lower')}`,
						},
					},
					{
						path: 'categorias/:slug/vacantes/:idVacante/edit',
						Component: VacanteEdit,
						handle: {
							title: (params: Record<string, string>) =>
								`Editar vacante en ${fromSlug(params.slug, 'lower')}`,
						},
					},

					{ path: 'vacantes', Component: VacanteList },
					{ path: 'vacantes/new', Component: VacanteCreate },
					{ path: 'vacantes/:idVacante/edit', Component: VacanteEdit },
					{ path: 'vacantes/:vacId/:vacSlug/postulaciones', Component: PostulacionCrud },
					{
						path: 'postulantes/:postulanteId/:postulanteSlug/postulaciones',
						Component: PostulacionCrud,
					},
					{ path: 'postulantes', Component: PostulanteList },

					{ path: 'estilos', Component: Estilos },

					// --- Superadmin (mismas rutas, sin prefijo especial, pero colgando de :empresa host superadmin) ---
					{ path: 'empresas', Component: EmpresaCrud },
					{ path: 'empresas/new', Component: EmpresaCrud },
					{ path: 'empresas/:id/edit', Component: EmpresaCrud },

					{ path: 'administradores', Component: AdminCrud },
					{ path: 'administradores/new', Component: AdminCrud },
					{ path: 'administradores/:id/edit', Component: AdminCrud },

					{ path: 'cuotas', Component: CuotasList },
				],
			},
		],
	},
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<RouterProvider router={router} />
	</React.StrictMode>,
);
