import * as React from 'react';
import { List } from '@toolpad/core/Crud';
import type { DataModelId } from '@toolpad/core/Crud';
import { useLocation, useNavigate, useParams } from 'react-router';

import SmartPageContainer from '../SmartPageContainer';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import { routeSpecs } from './routeSpecs';
import { useVacantesDataSource } from './useVacantesDataSource';
import { type Vacante } from '../../data/vacantes';
import { slugify } from '../../data/utils';

import { useGridApiRef } from '@mui/x-data-grid';

function PageWrapper(props: PageContainerProps) {
	return <SmartPageContainer {...props} routeSpecs={routeSpecs} />;
}

export default function VacanteList() {
	const { pathname } = useLocation();
	const { empresa, slug } = useParams<{ empresa: string; slug?: string }>();
	const navigate = useNavigate();

	const rootPath = React.useMemo(() => pathname.replace(/\/(new|edit)$/, ''), [pathname]);
	const isCategoriaView = Boolean(slug);

	const dataSource = useVacantesDataSource({ isCategoriaView, slug });

	const apiRef = useGridApiRef();

	const handleCreateClick = React.useCallback(() => {
		if (!empresa) return;

		if (isCategoriaView && slug) {
			navigate(`/${empresa}/categorias/${slug}/vacantes/new`);
			return;
		}

		navigate(`/${empresa}/vacantes/new`);
	}, [empresa, isCategoriaView, slug, navigate]);

	const handleEditClick = React.useCallback(
		(id: DataModelId) => {
			if (!empresa) return;

			const idStr = encodeURIComponent(String(id));

			if (isCategoriaView && slug) {
				navigate(`/${empresa}/categorias/${slug}/vacantes/${idStr}/edit`);
				return;
			}

			const row = apiRef.current?.getRow(id) as Vacante | undefined;
			const categoriaNombre = row?.categoria;

			if (categoriaNombre) {
				const categoriaSlug = encodeURIComponent(slugify(categoriaNombre));
				navigate(`/${empresa}/categorias/${categoriaSlug}/vacantes/${idStr}/edit`);
				return;
			}

			navigate(`/${empresa}/vacantes`);
		},
		[empresa, isCategoriaView, slug, navigate, apiRef],
	);

	return (
		<List<Vacante>
			dataSource={dataSource}
			initialPageSize={25}
			slots={{ pageContainer: PageWrapper }}
			onCreateClick={handleCreateClick}
			onEditClick={handleEditClick}
			slotProps={{
				dataGrid: {
					apiRef,
					pageSizeOptions: [25],
					sortingMode: 'server',
					disableColumnMenu: true,

					columnVisibilityModel: {
						id: false,
						categoria: !isCategoriaView,
						descripcion: false,
						modalidad: false,
						tipoTrabajo: false,
						fechaCreacion: false,
						habilidades: false,
						nivelExperiencia: false,
					},

					onRowClick: (params: { row: Vacante }) => {
						const row = params.row;
						const vacSlug = encodeURIComponent(slugify(row.vacante));
						navigate(`${rootPath}/${row.id}/${vacSlug}/postulaciones`);
					},
				},
			}}
		/>
	);
}
