import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

import { InputField } from '../components/Entradas';
import { enviarRestablecerClave } from '../api';

export default function RestablecerContraseña() {
	const [emailError, setEmailError] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [successMessage, setSuccessMessage] = useState<string>('');

	const mutation = useMutation({
		mutationFn: enviarRestablecerClave,
		onSuccess: (data) => {
			setSuccessMessage(data.message || 'Correo enviado correctamente');
			setErrorMessage('');
		},
		onError: (error: Error) => {
			setEmailError(true);
			setErrorMessage(error.message);
			setSuccessMessage('');
		},
	});

	const handleSubmit = (): void => {
		if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.trim())) {
			setEmailError(true);
			setErrorMessage('Ingresa un correo válido.');
		} else {
			setErrorMessage('');
			setEmailError(false);
			mutation.mutate(email);
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
			}}
		>
			<Paper
				component='form'
				sx={{
					p: 3,
					maxWidth: 500,
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Typography variant='h5' gutterBottom>
					Restablecer contraseña
				</Typography>
				<Typography>
					Ingresa tu correo electrónico para recibir instrucciones sobre cómo restablecer tu
					contraseña.
				</Typography>
				<InputField
					autoComplete='email'
					error={emailError}
					helperText={errorMessage}
					id='email'
					label='Correo electrónico'
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
					placeholder='tu@correo.com'
					required
					type='email'
				/>
				{successMessage && <FormHelperText>{successMessage}</FormHelperText>}
				<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
					<Button variant='contained' onClick={handleSubmit}>
						Continuar
					</Button>
				</div>
			</Paper>
		</Box>
	);
}
