import { useState } from 'react';
import { Container, Paper, Box, Typography, TextField, Button } from '@mui/material';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

interface CambiarClaveResponse {
	message: string;
}

interface ReiniciarClaveData {
	token: string;
	nuevaClave: string;
}

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

const cambiarClave = async (data: ReiniciarClaveData): Promise<CambiarClaveResponse> => {
	const { token, nuevaClave } = data;
	const response = await fetch(apiUrl(`/api/reiniciar-clave/${token}`), {
		method: 'POST', // O el método que requiera tu API (PUT, PATCH, etc.)
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ nuevaClave }),
	});

	if (!response.ok) {
		const errorData = await response.json();
		throw new Error(errorData.error || 'Error al cambiar la clave');
	}

	return response.json();
};

export default function CambiarContraseña() {
	// Se asume que el token se encuentra en la URL, por ejemplo: /reiniciar-clave/:token
	const { token } = useParams<{ token: string }>();

	const [nuevaClave, setNuevaClave] = useState<string>('');
	const [confirmarClave, setConfirmarClave] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [successMessage, setSuccessMessage] = useState<string>('');

	const mutation = useMutation({
		mutationFn: cambiarClave,
		onSuccess: (data) => {
			setSuccessMessage(data.message || 'Clave cambiada exitosamente');
			setErrorMessage('');
		},
		onError: (error) => {
			setErrorMessage(error.message);
			setSuccessMessage('');
		},
	});

	const handleSubmit = (event: React.FormEvent<HTMLFormElement>): void => {
		event.preventDefault();
		setErrorMessage('');
		setSuccessMessage('');

		if (nuevaClave !== confirmarClave) {
			setErrorMessage('Las claves no coinciden');
			return;
		}

		if (!token) {
			setErrorMessage('Token inválido');
			return;
		}

		mutation.mutate({ token, nuevaClave });
	};

	return (
		<Container maxWidth='sm' sx={{ mt: 8 }}>
			<Paper elevation={3} sx={{ p: 4 }}>
				<Typography variant='h5' component='h2' gutterBottom>
					Cambiar Clave
				</Typography>
				<Typography variant='body1' color='text.secondary' mb={2}>
					Ingresa tu nueva clave y confírmala.
				</Typography>

				{errorMessage && (
					<Typography color='error' mb={2}>
						{errorMessage}
					</Typography>
				)}

				{successMessage && (
					<Typography color='success.main' mb={2}>
						{successMessage}
					</Typography>
				)}

				<Box component='form' onSubmit={handleSubmit}>
					<TextField
						required
						fullWidth
						label='Nueva Clave'
						type='password'
						variant='outlined'
						margin='normal'
						value={nuevaClave}
						onChange={(e) => setNuevaClave(e.target.value)}
					/>

					<TextField
						required
						fullWidth
						label='Confirmar Clave'
						type='password'
						variant='outlined'
						margin='normal'
						value={confirmarClave}
						onChange={(e) => setConfirmarClave(e.target.value)}
					/>

					<Button type='submit' variant='contained' color='primary' fullWidth sx={{ mt: 2 }}>
						Cambiar Clave
					</Button>
				</Box>
			</Paper>
		</Container>
	);
}
