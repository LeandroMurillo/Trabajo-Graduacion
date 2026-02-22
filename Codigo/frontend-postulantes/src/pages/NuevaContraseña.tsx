import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { useSearchParams, useNavigate, useParams } from 'react-router-dom';

import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormHelperText from '@mui/material/FormHelperText';
import Box from '@mui/material/Box';

import { InputField } from '../components/Entradas';
import { validarResetCode, confirmarNuevaContraseña } from '../firebase/auth';

export default function NuevaContraseña() {
	const { empresa = '' } = useParams();
	const [params] = useSearchParams();
	const navigate = useNavigate();

	const oobCode = params.get('oobCode') ?? '';
	const mode = params.get('mode') ?? '';

	const [pass1, setPass1] = React.useState('');
	const [pass2, setPass2] = React.useState('');
	const [errorMessage, setErrorMessage] = React.useState('');
	const [successMessage, setSuccessMessage] = React.useState('');

	const invalidMode = mode && mode !== 'resetPassword';

	const { data, isLoading, isError } = useQuery({
		queryKey: ['validar-reset', empresa, oobCode],
		queryFn: () => validarResetCode(oobCode),
		enabled: Boolean(oobCode) && !invalidMode,
		retry: false,
	});

	const mutation = useMutation({
		mutationFn: ({ code, pass }: { code: string; pass: string }) =>
			confirmarNuevaContraseña(code, pass),
		onSuccess: () => {
			setSuccessMessage('Contraseña actualizada correctamente. Ya puedes iniciar sesión.');
			setErrorMessage('');
		},
		onError: (error: Error) => {
			setErrorMessage(error.message);
			setSuccessMessage('');
		},
	});

	function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();

		if (!empresa) {
			setErrorMessage('Empresa inválida en la URL.');
			return;
		}
		if (!oobCode) {
			setErrorMessage('Link inválido: falta el código de recuperación.');
			return;
		}
		if (invalidMode) {
			setErrorMessage('Link inválido: el modo no corresponde a restablecer contraseña.');
			return;
		}
		if (!pass1 || pass1.length < 6) {
			setErrorMessage('La contraseña debe tener al menos 6 caracteres.');
			return;
		}
		if (pass1 !== pass2) {
			setErrorMessage('Las contraseñas no coinciden.');
			return;
		}

		setErrorMessage('');
		mutation.mutate({ code: oobCode, pass: pass1 });
	}

	if (!empresa) {
		return (
			<Box
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
			>
				<Paper sx={{ p: 3, maxWidth: 520, width: '100%' }}>
					<Typography variant='h5' gutterBottom>
						Nueva contraseña
					</Typography>
					<FormHelperText error>Empresa inválida en la URL.</FormHelperText>
				</Paper>
			</Box>
		);
	}

	if (!oobCode) {
		return (
			<Box
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
			>
				<Paper sx={{ p: 3, maxWidth: 520, width: '100%' }}>
					<Typography variant='h5' gutterBottom>
						Nueva contraseña
					</Typography>
					<FormHelperText error>Link inválido o incompleto.</FormHelperText>
				</Paper>
			</Box>
		);
	}

	if (invalidMode) {
		return (
			<Box
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}
			>
				<Paper sx={{ p: 3, maxWidth: 520, width: '100%' }}>
					<Typography variant='h5' gutterBottom>
						Nueva contraseña
					</Typography>
					<FormHelperText error>
						Este enlace no es de restablecimiento de contraseña.
					</FormHelperText>
				</Paper>
			</Box>
		);
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
					maxWidth: 520,
					width: '100%',
					display: 'flex',
					flexDirection: 'column',
					gap: 2,
				}}
			>
				<Typography variant='h5' gutterBottom>
					Nueva contraseña
				</Typography>

				{isLoading && <FormHelperText>Validando enlace…</FormHelperText>}
				{isError && <FormHelperText error>Link inválido o expirado.</FormHelperText>}
				{data?.email && (
					<FormHelperText>
						Restableciendo contraseña para: <strong>{data.email}</strong>
					</FormHelperText>
				)}

				<InputField
					id='pass1'
					label='Nueva contraseña'
					type='password'
					required
					autoComplete='new-password'
					value={pass1}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setPass1(e.target.value);
						if (errorMessage) setErrorMessage('');
					}}
				/>
				<InputField
					id='pass2'
					label='Repetir nueva contraseña'
					type='password'
					required
					autoComplete='new-password'
					value={pass2}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
						setPass2(e.target.value);
						if (errorMessage) setErrorMessage('');
					}}
				/>

				{errorMessage && <FormHelperText error>{errorMessage}</FormHelperText>}
				{successMessage && <FormHelperText>{successMessage}</FormHelperText>}

				<div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 16 }}>
					<Button
						type='submit'
						variant='contained'
						disabled={isLoading || isError || mutation.isPending || Boolean(successMessage)}
					>
						Confirmar
					</Button>
				</div>

				{successMessage && (
					<div style={{ display: 'flex', justifyContent: 'flex-end' }}>
						<Button variant='text' onClick={() => navigate(`/${empresa}/login`)}>
							Ir a iniciar sesión
						</Button>
					</div>
				)}
			</Paper>
		</Box>
	);
}
