import { List } from '@toolpad/core/Crud';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import SmartPageContainer, { type RouteSpec } from './SmartPageContainer';

import { cuotasDataSource } from '../data/cuotas';

type P = Record<string, string>;

const cuotasRouteSpecs: RouteSpec[] = [
	{
		path: '/cuotas',
		title: 'Todas las cuotas',
		breadcrumbs: [{ title: 'cuotas', path: (p: P) => `/${p.empresa}/cuotas` }],
	},
];

function CuotasPageContainer(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={cuotasRouteSpecs} />;
}

export default function CuotasList() {
	return (
		<List
			dataSource={cuotasDataSource}
			initialPageSize={25}
			slots={{
				pageContainer: CuotasPageContainer,
			}}
			slotProps={{
				dataGrid: {
					disableColumnMenu: true,
					disableColumnSelector: true,
					sortingOrder: ['asc', 'desc'],
					showToolbar: true,
					slotProps: {
						toolbar: {
							showQuickFilter: false,
							disableDensitySelector: true,
							disableExport: true,
						},
					},
					sx: {
						'& .MuiDataGrid-toolbarContainer .MuiButtonBase-root[aria-label*="Density"]': {
							display: 'none',
						},
						'& .MuiDataGrid-toolbarContainer .MuiButtonBase-root[aria-label*="Densidad"]': {
							display: 'none',
						},
						'& .MuiDataGrid-toolbarContainer .MuiButtonBase-root[aria-label*="Export"]': {
							display: 'none',
						},
						'& .MuiDataGrid-toolbarContainer .MuiButtonBase-root[aria-label*="Exportar"]': {
							display: 'none',
						},
					},
				},
			}}
		/>
	);
}
