import * as React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useLocation, useNavigate, useParams } from 'react-router';

import DialogSubirCurriculum from './DialogSubirCurriculum';
import DialogVerCurriculum from './DialogVerCurriculum';

import { dameCurriculum, headCurriculum } from '../api';
import type { Curriculum } from '../types';
import { useSnackbar } from 'notistack';

type Mode = 'closed' | 'view' | 'upload';

interface DialogPostularseProps {
	open: boolean;
	onClose: () => void;
}

function DialogPostularse({ open, onClose }: DialogPostularseProps) {
	const [mode, setMode] = React.useState<Mode>('closed');
	const [selectedPdf, setSelectedPdf] = React.useState<Curriculum | null>(null);
	const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);
	const [displayName, setDisplayName] = React.useState<string>('Currículum activo');

	const navigate = useNavigate();
	const location = useLocation();
	const { enqueueSnackbar } = useSnackbar();
	const { empresa } = useParams();
	const { data: pdfList, refetch } = useQuery({
		queryKey: ['curriculums'],
		queryFn: dameCurriculum,
		enabled: false,
		retry: false,
	});

	React.useEffect(() => {
		if (pdfList?.length) setSelectedPdf(pdfList[0]);
	}, [pdfList]);

	React.useEffect(() => {
		if (open) handleClickOpen();
	}, [open]);

	const handleClickOpen = async () => {
		try {
			const { status, filename, url } = await headCurriculum();

			if (status === 401) {
				const base = empresa ? `/${empresa}` : '';
				navigate(
					`${base}/login?callbackUrl=${encodeURIComponent(location.pathname + location.search)}`,
				);
				onClose();
				return;
			}

			if (status === 200) {
				setDisplayName(filename || 'Currículum activo');
				setPdfUrl(url);
				setMode('view');
			} else if (status === 404) {
				setMode('upload');
				await refetch().catch(() => {});
			} else {
				setMode('upload');
			}
		} catch {
			setMode('upload');
		}
	};

	const handleCloseView = () => {
		setMode('closed');
		onClose();
	};

	const handleCloseUpload = (value: Curriculum | null) => {
		setMode('closed');

		if (value) {
			setSelectedPdf(value);
			// volvemos a usar la misma URL del HEAD (GET /api/curriculums)
			headCurriculum()
				.then(({ url }) => {
					setPdfUrl(url);
					setMode('view');
				})
				.catch(() => {
					// si falla, al menos mostramos mensaje
					enqueueSnackbar('El currículum fue subido, pero no se pudo cargar la vista previa.', {
						variant: 'warning',
					});
				});

			enqueueSnackbar('El currículum fue subido correctamente.', {
				variant: 'success',
			});
		} else {
			onClose();
		}
	};

	const handleReplace = async () => {
		setMode('upload');
		await refetch().catch(() => {});
	};

	const handlePostularse = () => {
		setMode('closed');
		enqueueSnackbar('Postulación realizada correctamente.', {
			variant: 'success',
		});
		onClose();
	};

	return (
		<>
			<DialogSubirCurriculum
				open={mode === 'upload'}
				onClose={handleCloseUpload}
				selectedValue={selectedPdf}
			/>

			<DialogVerCurriculum
				open={mode === 'view'}
				onClose={handleCloseView}
				pdfUrl={pdfUrl}
				displayName={displayName}
				onReplace={handleReplace}
				onPostularse={handlePostularse}
			/>
		</>
	);
}

export default DialogPostularse;
