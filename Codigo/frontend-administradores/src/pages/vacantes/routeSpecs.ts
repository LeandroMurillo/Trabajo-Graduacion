import { fromSlug } from '../../data/utils';

type P = Record<string, string>;

export const routeSpecs = [
	{
		path: '/vacantes',
		title: 'Todas las vacantes',
		breadcrumbs: [{ title: 'vacantes', path: (p: P) => `/${p.empresa}/vacantes` }],
	},
	{
		path: '/vacantes/new',
		title: 'Nueva vacante',
		breadcrumbs: [
			{ title: 'vacantes', path: (p: P) => `/${p.empresa}/vacantes` },
			{ title: 'nueva vacante' },
		],
	},
	{
		path: '/vacantes/:idVacante/edit',
		title: 'Editar vacante',
		breadcrumbs: [
			{ title: 'vacantes', path: (p: P) => `/${p.empresa}/vacantes` },
			{ title: 'editar vacante' },
		],
	},

	{
		path: '/categorias/:slug/vacantes',
		title: (params: P) => `Vacantes de ${fromSlug(params.slug, 'lower')}`,
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			// ✅ (opcional) lo dejo NO clickeable como lo tenías
			{ title: (p: P) => fromSlug(p.slug, 'lower') },
		],
	},
	{
		path: '/categorias/:slug/vacantes/new',
		title: (params: P) => `Nueva vacante en ${fromSlug(params.slug, 'lower')}`,
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			{
				title: (p: P) => fromSlug(p.slug, 'lower'),
				path: (p: P) => `/${p.empresa}/categorias/${p.slug}/vacantes`,
			},
			{ title: 'nueva vacante' },
		],
	},
	{
		path: '/categorias/:slug/vacantes/:idVacante/edit',
		title: (params: P) => `Editar vacante en ${fromSlug(params.slug, 'lower')}`,
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			{
				title: (p: P) => fromSlug(p.slug, 'lower'),
				path: (p: P) => `/${p.empresa}/categorias/${p.slug}/vacantes`,
			},
			{ title: 'editar vacante' },
		],
	},
];
