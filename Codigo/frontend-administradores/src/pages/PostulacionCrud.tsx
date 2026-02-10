import * as React from 'react';
import { List } from '@toolpad/core/Crud';
import { useParams, useNavigate } from 'react-router';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import SmartPageContainer from './SmartPageContainer';
import { postulacionesDataSource, Postulacion } from '../data/postulaciones';
import { getApiBase } from '../App';
import { fetchJson } from '../data/utils';
import { fromSlug } from '../data/utils';

function toSlug(value: string) {
	return value
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/,/g, '')
		.toLowerCase()
		.trim()
		.replace(/\s+/g, '-')
		.replace(/[^a-z0-9-]/g, '')
		.replace(/-+/g, '-');
}

const API = getApiBase();

type P = Record<string, string>;

const routeSpecs = [
	{
		path: '/vacantes/:vacId/:vacSlug/postulaciones',
		title: (params: Record<string, string>) =>
			`Postulaciones para ${fromSlug(params.vacSlug, 'lower')}`,
		breadcrumbs: [
			{ title: 'vacantes', path: (p: P) => `/${p.empresa}/vacantes` },
			{ title: (params: Record<string, string>) => fromSlug(params.vacSlug, 'lower') },
		],
	},
	{
		path: '/postulantes/:postulanteId/:postulanteSlug/postulaciones',
		title: (params: Record<string, string>) =>
			`Postulaciones de ${fromSlug(params.postulanteSlug, 'title')}`,
		breadcrumbs: [
			{ title: 'postulantes', path: (p: P) => `/${p.empresa}/postulantes` },
			{ title: (params: Record<string, string>) => fromSlug(params.postulanteSlug, 'lower') },
		],
	},
	{
		path: '/categorias/:catSlug/vacantes/:vacId/:vacSlug/postulaciones',
		title: (params: Record<string, string>) =>
			`Postulaciones para ${fromSlug(params.vacSlug, 'lower')}`,
		breadcrumbs: [
			{ title: 'categorías', path: (p: P) => `/${p.empresa}/categorias` },
			{
				title: (params: Record<string, string>) => fromSlug(params.catSlug, 'lower'),
				path: (p: P & Record<string, string>) => `/${p.empresa}/categorias/${p.catSlug}/vacantes`,
			},
			{ title: (params: Record<string, string>) => fromSlug(params.vacSlug, 'lower') },
		],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={routeSpecs} />;
}

export default function PostulacionCrud() {
	const navigate = useNavigate();
	const { empresa, vacId, postulanteId } = useParams();

	const isPostulanteView = Boolean(postulanteId);

	const dataSource = React.useMemo(() => {
		return {
			...postulacionesDataSource,

			async getMany() {
				if (vacId) {
					const url = `${API}/admin/vacantes/${encodeURIComponent(vacId)}/postulaciones`;
					const data = (await fetchJson(url)) as Postulacion[];
					return { items: data, itemCount: data.length };
				}

				if (postulanteId) {
					const url = `${API}/admin/postulantes/${encodeURIComponent(postulanteId)}/postulaciones`;
					const data = (await fetchJson(url)) as Postulacion[];
					return { items: data, itemCount: data.length };
				}

				return { items: [], itemCount: 0 };
			},
		};
	}, [vacId, postulanteId]);

	return (
		<List<Postulacion>
			dataSource={dataSource}
			initialPageSize={25}
			slots={{ pageContainer: PageWrapper }}
			slotProps={{
				dataGrid: {
					columnVisibilityModel: {
						id: false,
						idPostulante: false,
						vacante: isPostulanteView,
						postulante: !isPostulanteView,
						fechaPostulacion: true,
						cv: true,
					},
					disableRowSelectionOnClick: true,
					onCellClick: (params: { field: string }, event: React.MouseEvent) => {
						if (params.field === 'cv') event.stopPropagation();
					},
					onRowClick: (params: { row: Postulacion }) => {
						const row = params.row;

						if (row.idPostulante) {
							if (!empresa) return;

							const slug = toSlug(row.postulante ?? 'postulante');

							navigate(`/${empresa}/postulantes/${row.idPostulante}/${slug}/postulaciones`);
							return;
						}

						navigate(`/${empresa ?? ''}/postulaciones/${row.id}`);
					},
				},
			}}
		/>
	);
}
