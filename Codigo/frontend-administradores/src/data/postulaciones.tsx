import * as React from 'react';
import { IconButton } from '@mui/material';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import { DataModel, DataSource } from '@toolpad/core/Crud';
import { toDate, fetchBlob } from './utils';
import { getApiBase } from '../App';

export interface Postulacion extends DataModel {
	id: number;
	idPostulante: string;
	vacante: string;
	postulante: string;
	fechaPostulacion: string;
	localidadPostulante?: string | null;
}

const API = getApiBase();

export const postulacionesDataSource: DataSource<Postulacion> = {
	fields: [
		{
			field: 'cv',
			headerName: 'CV',
			width: 70,
			sortable: false,
			filterable: false,
			renderCell: (params) => {
				const idPostulacion = params.row.id as number | undefined;

				async function handleOpen(e: React.MouseEvent) {
					e.stopPropagation();
					if (!idPostulacion) return;

					const url = `${API}/admin/postulaciones/${encodeURIComponent(String(idPostulacion))}/curriculum`;

					try {
						const blob = await fetchBlob(url);
						const blobUrl = URL.createObjectURL(blob);
						window.open(blobUrl, '_blank', 'noopener,noreferrer');
						setTimeout(() => URL.revokeObjectURL(blobUrl), 60_000);
					} catch (err) {
						console.error(err);
					}
				}

				return (
					<IconButton size='small' onClick={handleOpen} disabled={!idPostulacion}>
						<FileOpenIcon />
					</IconButton>
				);
			},
		},
		{ field: 'id', headerName: 'ID', width: 80 },
		{ field: 'vacante', headerName: 'Vacante', width: 220 },
		{ field: 'postulante', headerName: 'Postulante', width: 220 },
		{
			field: 'fechaPostulacion',
			headerName: 'Fecha',
			type: 'dateTime',
			valueGetter: (v) => toDate(v),
			width: 180,
		},
		{ field: 'localidadPostulante', headerName: 'Localidad Postulante', width: 150 },
	],
};
