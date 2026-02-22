import * as React from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { applyActionCode, checkActionCode } from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseConfig';
import { Box, CircularProgress, Typography, Alert, Button, Stack } from '@mui/material';

type Estado = 'procesando' | 'error';

export default function AuthAction() {
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const [estado, setEstado] = React.useState<Estado>('procesando');
	const [mensajeError, setMensajeError] = React.useState<string>('');
	const yaProcesadoRef = React.useRef(false);

	React.useEffect(() => {
		if (yaProcesadoRef.current) return;
		yaProcesadoRef.current = true;

		async function run() {
			const mode = params.get('mode') ?? '';
			const oobCode = params.get('oobCode') ?? '';
			const continueUrl = params.get('continueUrl') ?? '';

			if (!mode || !oobCode) {
				setMensajeError('El enlace es inválido o está incompleto.');
				setEstado('error');
				return;
			}

			let empresa = '';
			if (continueUrl) {
				try {
					const u = new URL(continueUrl);
					const parts = u.pathname.split('/').filter(Boolean);
					if (parts.length > 0) empresa = parts[0];
				} catch {
					if (continueUrl.startsWith('/')) {
						const parts = continueUrl.split('/').filter(Boolean);
						if (parts.length > 0) empresa = parts[0];
					}
				}
			}

			const base = empresa ? `/${empresa}` : '';

			if (mode === 'verifyEmail') {
				await applyActionCode(firebaseAuth, oobCode);
				navigate(`${base}/login?verified=1`, { replace: true });
				return;
			}

			if (mode === 'resetPassword') {
				await checkActionCode(firebaseAuth, oobCode);
				navigate(`${base}/reset-password?oobCode=${encodeURIComponent(oobCode)}`, {
					replace: true,
				});
				return;
			}

			setMensajeError(`Modo de acción no soportado: ${mode}`);
			setEstado('error');
		}

		run().catch((error: unknown) => {
			console.error('AuthAction error:', error);

			let msg = 'No se pudo procesar el enlace.';
			if (typeof error === 'object' && error !== null && 'code' in error) {
				const code = String((error as { code?: unknown }).code ?? '');
				if (code === 'auth/invalid-action-code') {
					msg = 'El enlace es inválido o ya fue utilizado.';
				} else if (code === 'auth/expired-action-code') {
					msg = 'El enlace ha expirado.';
				}
			}

			setMensajeError(msg);
			setEstado('error');
		});
	}, [params, navigate]);

	if (estado === 'procesando') {
		return (
			<Box
				sx={{
					minHeight: '100vh',
					display: 'flex',
					alignItems: 'center',
					justifyContent: 'center',
					px: 2,
				}}
			>
				<Stack spacing={2} alignItems='center'>
					<CircularProgress />
					<Typography>Procesando enlace...</Typography>
				</Stack>
			</Box>
		);
	}

	return (
		<Box
			sx={{
				minHeight: '100vh',
				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',
				px: 2,
			}}
		>
			<Stack spacing={2} sx={{ width: '100%', maxWidth: 420 }}>
				<Alert severity='error'>{mensajeError}</Alert>
				<Button variant='contained' onClick={() => navigate('/', { replace: true })}>
					Volver
				</Button>
			</Stack>
		</Box>
	);
}
