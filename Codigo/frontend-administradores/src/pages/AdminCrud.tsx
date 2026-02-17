import * as React from 'react';
import { Crud } from '@toolpad/core/Crud';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import { useParams } from 'react-router';
import SmartPageContainer from './SmartPageContainer';

import {
	createAdministradorDataSource,
	type Administrador,
	type EmpresaOption,
} from '../data/administradores';
import { fetchJson } from '../data/utils';

type P = Record<string, string>;

export const administradoresRouteSpecs = [
	{
		path: '/administradores',
		title: 'Todos los administradores',
		breadcrumbs: [{ title: 'administradores', path: (p: P) => `/${p.empresa}/administradores` }],
	},
	{
		path: '/administradores/new',
		title: 'Nuevo administrador',
		breadcrumbs: [
			{ title: 'administradores', path: (p: P) => `/${p.empresa}/administradores` },
			{ title: 'nuevo administrador' },
		],
	},
	{
		path: '/administradores/:id/edit',
		title: 'Editar administrador',
		breadcrumbs: [
			{ title: 'administradores', path: (p: P) => `/${p.empresa}/administradores` },
			{ title: 'editar administrador' },
		],
	},
];

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={administradoresRouteSpecs} />;
}

const EMPRESAS_API = `${import.meta.env.VITE_API_URL}/superadmin/empresas?soloActivas=true`;
interface EmpresaRow {
	empresa?: string;
	nombre?: string;
}

export default function AdminCrud() {
	const { empresa } = useParams();
	const rootPath = empresa ? `/${empresa}/administradores` : '/administradores';

	const [empresaOptions, setEmpresaOptions] = React.useState<EmpresaOption[]>([]);

	React.useEffect(() => {
		let alive = true;

		(async () => {
			try {
				const data = await fetchJson(EMPRESAS_API);

				const options: EmpresaOption[] = (Array.isArray(data) ? data : [])
					.map((e: EmpresaRow) => {
						const label = String(e.empresa ?? e.nombre ?? '').trim();
						const value = label;
						return { value, label };
					})
					.filter((o) => o.value.length > 0);

				if (alive) setEmpresaOptions(options);
			} catch {
				if (alive) setEmpresaOptions([]);
			}
		})();

		return () => {
			alive = false;
		};
	}, []);

	const dataSource = React.useMemo(
		() => createAdministradorDataSource(empresaOptions),
		[empresaOptions],
	);

	return (
		<Crud<Administrador>
			dataSource={dataSource}
			rootPath={rootPath}
			initialPageSize={25}
			slots={{ pageContainer: PageWrapper }}
			defaultValues={{ rol: 'ADMIN' }}
			slotProps={{
				list: {
					dataGrid: {
						columnVisibilityModel: { clave: false, confirmarClave: false },
					},
				},
			}}
		/>
	);
}
