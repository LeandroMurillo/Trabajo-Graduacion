import * as React from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router';
import { Button, Link, Stack, Typography, TextField } from '@mui/material';
import { SignInPage, type AuthProvider } from '@toolpad/core/SignInPage';
import { useSession } from '../SessionContext';
import { loginPostulante } from '../api';

import {
	setPersistence,
	browserSessionPersistence,
	signInWithEmailAndPassword,
	signOut,
} from 'firebase/auth';
import { firebaseAuth } from '../firebase/firebaseConfig';

export default function PaginaLogin() {
	const navigate = useNavigate();
	const { empresa } = useParams();
	const { refreshSession } = useSession();

	async function handleSignIn(provider: AuthProvider, formData: FormData, callbackUrl?: string) {
		try {
			const email = String(formData.get('email') || '').trim();
			const password = String(formData.get('password') || '');

			if (!email || !password) {
				return { error: 'Email y contraseña son obligatorios' };
			}

			await setPersistence(firebaseAuth, browserSessionPersistence);

			const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);

			const idToken = await userCredential.user.getIdToken(true);

			try {
				await loginPostulante(idToken);
			} catch (backendError) {
				try {
					await signOut(firebaseAuth);
				} catch (signOutError) {
					console.warn(
						'[login] No se pudo cerrar sesión local luego de error backend:',
						signOutError,
					);
				}
				throw backendError;
			}

			await refreshSession();

			const base = empresa ? `/${empresa}` : '';
			const target = callbackUrl ? `${base}${callbackUrl}` : base || '/';

			navigate(target, { replace: true });
			return {};
		} catch (error: unknown) {
			return {
				error: error instanceof Error ? error.message : 'Error inesperado al iniciar sesión',
			};
		}
	}

	function CustomTitle() {
		return (
			<Typography
				component='h1'
				variant='h4'
				sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
			>
				Iniciar sesión
			</Typography>
		);
	}

	function CustomEmailField(props: React.ComponentProps<typeof TextField>) {
		return (
			<TextField
				autoComplete='email'
				name='email'
				label='Correo electrónico'
				placeholder='tu@correo.com'
				required
				type='email'
				{...props}
			/>
		);
	}

	function CustomPasswordField(props: React.ComponentProps<typeof TextField>) {
		return (
			<TextField
				autoComplete='current-password'
				name='password'
				label='Contraseña'
				required
				type='password'
				{...props}
			/>
		);
	}

	function CustomSubmitButton() {
		return (
			<Button type='submit' fullWidth variant='contained'>
				Iniciar sesión
			</Button>
		);
	}

	function CustomForgotPasswordLink() {
		const to = empresa ? `/${empresa}/forgot-password` : '/forgot-password';
		return <RouterLink to={to}>Olvidé mi contraseña</RouterLink>;
	}

	function CustomSignUpLink() {
		function handleClickRegistro() {
			const to = empresa ? `/${empresa}/signup` : '/signup';
			navigate(to);
		}

		return (
			<Stack
				sx={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					bgcolor: 'background.paper',
					paddingTop: 2,
					gap: 1,
				}}
			>
				<Typography sx={{ textAlign: 'center' }}>
					¿No tienes una cuenta?{' '}
					<Link
						component='button'
						type='button'
						onClick={handleClickRegistro}
						sx={{ alignSelf: 'center' }}
					>
						Regístrate
					</Link>
				</Typography>
			</Stack>
		);
	}

	return (
		<SignInPage
			providers={[{ id: 'credentials', name: 'Correo y Contraseña' }]}
			signIn={handleSignIn}
			slots={{
				title: CustomTitle,
				subtitle: () => <Typography></Typography>,
				emailField: CustomEmailField,
				passwordField: CustomPasswordField,
				submitButton: CustomSubmitButton,
				forgotPasswordLink: CustomForgotPasswordLink,
				signUpLink: CustomSignUpLink,
			}}
			slotProps={{ emailField: { autoFocus: false } }}
		/>
	);
}
