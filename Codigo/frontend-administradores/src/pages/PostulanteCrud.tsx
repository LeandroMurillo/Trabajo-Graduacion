import { List } from '@toolpad/core/Crud';
import { useNavigate, useParams } from 'react-router';
import { PostulantesDataSource, Postulante } from '../data/postulantes';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import SmartPageContainer from './SmartPageContainer';
import { fetchJson } from '../data/utils';
import { getApiBase } from '../App';

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

type P = Record<string, string>;

const routeSpecs = [
	{
		path: '/postulantes',
		title: 'Todos los postulantes',
		breadcrumbs: [{ title: 'postulantes', path: (p: P) => `/${p.empresa}/postulantes` }],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={routeSpecs} />;
}

function getPostulantesApiBase() {
	const apiBase = getApiBase();
	return `${apiBase}/admin/postulantes`;
}

export default function PostulanteList() {
	const navigate = useNavigate();
	const { empresa } = useParams();

	return (
		<List<Postulante>
			dataSource={{
				...PostulantesDataSource,
				async getMany() {
					const API_BASE = getPostulantesApiBase();
					const data = await fetchJson(`${API_BASE}`);
					return { items: data, itemCount: data.length };
				},
			}}
			initialPageSize={25}
			slots={{ pageContainer: PageWrapper }}
			slotProps={{
				dataGrid: {
					pageSizeOptions: [25],
					columnVisibilityModel: { id: false },
					onRowClick: (params: { row: Postulante }) => {
						const row = params.row;
						if (!empresa) return;

						const displayName =
							row.apellidos && row.nombres ? `${row.apellidos}, ${row.nombres}` : String(row.id);

						const postulanteSlug = toSlug(displayName);

						navigate(`/${empresa}/postulantes/${row.id}/${postulanteSlug}/postulaciones`);
					},
				},
			}}
		/>
	);
}
