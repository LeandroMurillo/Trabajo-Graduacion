import * as React from 'react';

import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

import InputFileUpload from './InputFileUpload';
import { altaCurriculum, sha256File } from '../api';
import { Curriculum } from '../types';

interface DialogSubirCurriculumProps {
	open: boolean;
	onClose: (value: Curriculum | null) => void;
	selectedValue: Curriculum | null;
}

type Issue = {
	message?: string;
};

// Interfaz para la respuesta de la API
interface ApiResponse {
	error?: string;
	message?: string;
	issues?: Issue[];
	data?: {
		id?: string;
		nombre?: string;
	};
	id?: string;
}

type ErrorData = {
	message?: string;
	error?: string;
	issues?: Issue[];
};

type ErrorWithResponse = {
	response?: {
		data?: ErrorData;
	};
};

function DialogSubirCurriculum({ open, onClose, selectedValue }: DialogSubirCurriculumProps) {
	const [errorMsg, setErrorMsg] = React.useState<string | null>(null);

	React.useEffect(() => {
		if (open) setErrorMsg(null);
	}, [open]);

	const handleClose = () => {
		setErrorMsg(null);
		onClose(selectedValue);
	};

	const handleFileUpload = async (files: File[]) => {
		if (!files?.length) return;

		setErrorMsg(null);
		try {
			const file = files[0];
			const hash = await sha256File(file);

			// Casteamos la respuesta a una interfaz conocida
			const resp = (await altaCurriculum(file, hash)) as ApiResponse;

			if (resp?.error || resp?.issues) {
				const friendly =
					resp?.message ||
					resp?.error ||
					(Array.isArray(resp?.issues)
						? resp.issues.map((i: Issue) => i?.message).join(' • ')
						: null) ||
					'No se pudo subir el archivo. Intentalo nuevamente.';
				setErrorMsg(friendly);
				return;
			}

			const uploadedPdf: Curriculum = {
				id: resp?.data?.id || resp?.id || hash,
				nombre: resp?.data?.nombre || file.name,
			};

			onClose(uploadedPdf);
		} catch (err: unknown) {
			// Safely access the nested error data using the type assertion
			const data = (err as ErrorWithResponse)?.response?.data;
			const friendly =
				data?.message ||
				data?.error ||
				(Array.isArray(data?.issues)
					? data.issues.map((i: Issue) => i?.message).join(' • ')
					: null) ||
				'No se pudo subir el archivo. Intentalo nuevamente.';
			setErrorMsg(friendly);
			return;
		}
	};

	return (
		<Dialog onClose={handleClose} open={open}>
			<DialogTitle>Sube un currículum para postularte</DialogTitle>

			{errorMsg && (
				<Typography variant='body2' color='error' role='alert' sx={{ px: 3, mt: 0.5 }}>
					{errorMsg}
				</Typography>
			)}

			<Box sx={{ p: 2 }}>
				<Typography variant='subtitle1' gutterBottom>
					Asegurate de que incluya:
				</Typography>
				<List sx={{ listStyleType: 'disc', pl: 3 }}>
					<Typography component='li' variant='body2'>
						Nombre y apellido completos
					</Typography>
					<Typography component='li' variant='body2'>
						Datos de contacto (teléfono y correo electrónico)
					</Typography>
					<Typography component='li' variant='body2'>
						Formación académica o estudios cursados
					</Typography>
					<Typography component='li' variant='body2'>
						Experiencia laboral relevante
					</Typography>
					<Typography component='li' variant='body2'>
						Habilidades o competencias destacadas
					</Typography>
					<Typography component='li' variant='body2'>
						Formato PDF (tamaño máximo 1 MB)
					</Typography>
				</List>
			</Box>

			<InputFileUpload onFileChange={handleFileUpload} />
		</Dialog>
	);
}

export default DialogSubirCurriculum;
