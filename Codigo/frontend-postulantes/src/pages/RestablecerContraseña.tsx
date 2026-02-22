import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

import { InputField } from '../components/Entradas';
import { enviarRestablecerContraseña } from '../firebase/auth';

export default function RestablecerContraseña() {
	const { empresa = '' } = useParams();

	const [emailError, setEmailError] = useState<boolean>(false);
	const [email, setEmail] = useState<string>('');
	const [errorMessage, setErrorMessage] = useState<string>('');
	const [successMessage, setSuccessMessage] = useState<string>('');

	const mutation = useMutation({
		mutationFn: enviarRestablecerContraseña,
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

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const emailTrim = email.trim();
		if (!emailTrim || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(emailTrim)) {
			setEmailError(true);
			setErrorMessage('Ingresa un correo válido.');
			return;
		}
		if (!empresa) {
			setEmailError(true);
			setErrorMessage('Empresa inválida en la URL.');
			return;
		}

		setErrorMessage('');
		setEmailError(false);
		setSuccessMessage('');
		mutation.mutate({ email: emailTrim, empresa });
	}

	return (
		<Box
			sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
		>
			<Paper
				component='form'
				onSubmit={handleSubmit}
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
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setEmail(e.target.value);
						if (emailError) setEmailError(false);
						if (errorMessage) setErrorMessage('');
					}}
					placeholder='tu@correo.com'
					required
					type='email'
				/>

				{successMessage && <FormHelperText>{successMessage}</FormHelperText>}

				<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
					<Button type='submit' variant='contained' disabled={mutation.isPending}>
						Continuar
					</Button>
				</div>
			</Paper>
		</Box>
	);
}
