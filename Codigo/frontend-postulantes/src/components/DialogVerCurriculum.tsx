import * as React from 'react';
import { useParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';

interface DialogVerCurriculumProps {
	open: boolean;
	onClose: () => void;
	pdfUrl: string | null;
	displayName?: string;
	onReplace: () => void;
	onPostularse?: () => void;
	onSuccess?: (estado: 'OK' | 'OK_EXISTENTE', message: string) => void;
}

type ApiResponse = {
	estado?: 'OK' | 'OK_EXISTENTE';
	message?: string;
	error?: string;
};

/* ===== Helper multiempresa por path: trabajo.com/:empresa/... ===== */

const API_ORIGIN = import.meta.env.VITE_API_URL;

function getEmpresaSlug(): string {
	// ej: "/acme", "/acme/ofertas/123"
	const path = window.location.pathname.replace(/^\/+/, ''); // quita "/" inicial
	const [slug] = path.split('/');
	// podés cambiar 'acme' por una empresa por defecto si querés
	return slug || 'acme';
}

function apiUrl(path: string): string {
	// nos aseguramos de que path empiece con "/"
	if (!path.startsWith('/')) {
		path = `/${path}`;
	}
	const slug = getEmpresaSlug();
	// queda: http://trabajo.com:3000/acme/api/...
	return `${API_ORIGIN}/${slug}${path}`;
}

export default function DialogVerCurriculum({
	open,
	onClose,
	pdfUrl,
	onReplace,
	onPostularse,
	onSuccess,
}: DialogVerCurriculumProps) {
	const titleId = 'dialog-cv-title';
	const { pIdVacante } = useParams<{ pCategoria: string; pIdVacante: string; slug?: string }>();
	const idVacanteNum = Number(pIdVacante);
	const idVacanteValido = Number.isFinite(idVacanteNum) && idVacanteNum > 0;

	const [loading, setLoading] = React.useState<boolean>(!!pdfUrl);
	const [error, setError] = React.useState<string | null>(null);
	const [submitting, setSubmitting] = React.useState(false);
	const [serverMsg, setServerMsg] = React.useState<string | null>(null);
	const [serverError, setServerError] = React.useState<string | null>(null);

	React.useEffect(() => {
		setLoading(!!pdfUrl);
		setError(null);
		setServerMsg(null);
		setServerError(null);
	}, [pdfUrl, open]);

	async function handlePostularse() {
		if (!idVacanteValido) {
			setServerError('No se reconoce el identificador de la vacante en la URL.');
			return;
		}
		setSubmitting(true);
		setServerMsg(null);
		setServerError(null);
		try {
			const url = apiUrl('/api/postulaciones');
			const resp = await fetch(url, {
				method: 'POST',
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ idVacante: idVacanteNum }),
			});

			const data: ApiResponse = await resp.json().catch(() => ({}));

			if (resp.ok) {
				const estado =
					(data?.estado as 'OK' | 'OK_EXISTENTE') ?? (resp.status === 201 ? 'OK' : 'OK_EXISTENTE');
				const message =
					data?.message ??
					(estado === 'OK'
						? 'Postulación realizada exitosamente.'
						: 'Ya te habías postulado a esta vacante.');
				setServerMsg(message);
				onSuccess?.(estado, message);
				onPostularse?.();
			} else {
				const msg = data?.error || 'No se pudo completar la postulación.';
				setServerError(msg);
			}
		} catch {
			setServerError('Error de red. Intentá nuevamente.');
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='md' aria-labelledby={titleId}>
			<DialogContent sx={{ p: 0 }}>
				{loading && (
					<Box
						sx={{
							position: 'absolute',
							inset: 0,
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
						}}
					>
						<Typography variant='body2' color='text.secondary'>
							Cargando PDF…
						</Typography>
					</Box>
				)}
				{!pdfUrl ? (
					<Typography variant='body2' color='text.secondary'>
						No se encontró un archivo para visualizar. Vuelve a subir tu currículum.
					</Typography>
				) : (<iframe
					title='Visor de Currículum'
					src={pdfUrl}
					loading='lazy'
					onLoad={() => setLoading(false)}
					onError={() => {
						setLoading(false);
						setError('No se pudo cargar el PDF.');
					}}
					style={{ width: '100%', height: 640, border: 'none' }}
				/>)}

				{error && (
					<Box sx={{ pt: 1 }}>
						<Typography variant='body2' color='error'>
							{error}
						</Typography>
					</Box>
				)}

				{!idVacanteValido && (
					<Box sx={{ pt: 1 }}>
						<Alert severity='warning'>
							La URL no contiene un identificador de vacante válido. Verificá el enlace.
						</Alert>
					</Box>
				)}

				{serverMsg && (
					<Box sx={{ pt: 1 }}>
						<Alert severity='success'>{serverMsg}</Alert>
					</Box>
				)}

				{serverError && (
					<Box sx={{ pt: 1 }}>
						<Alert severity='error'>{serverError}</Alert>
					</Box>
				)}
			</DialogContent>

			<DialogActions sx={{ px: 2, py: 1.5 }}>
				<Button onClick={onReplace} variant='outlined' disabled={submitting} color="error">
					Reemplazar currículum
				</Button>

				<Box sx={{ flexGrow: 1 }} />

				<Button onClick={onClose} disabled={submitting}>
					Cancelar
				</Button>
				<Button
					onClick={handlePostularse}
					variant='contained'
					disabled={!pdfUrl || submitting || !idVacanteValido}
				>
					{submitting ? 'Enviando…' : 'Postularse'}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
