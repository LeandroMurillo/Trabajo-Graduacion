// src/App.tsx
import * as React from 'react';

import { Outlet, useParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';

import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { type Navigation, type Session as ToolpadSession } from '@toolpad/core/AppProvider';

import { createTheme, type Theme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

import HomeIcon from '@mui/icons-material/Home';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountBoxIcon from '@mui/icons-material/AccountBox';

import { SnackbarProvider } from 'notistack';
import { fetchEstilo, fetchNombreEmpresa, logoutPostulante } from './api';

// 👇 usamos el contexto real de sesión
import { SessionProvider, useSession } from './SessionContext';

export function useEstiloTheme(): { theme: Theme } {
	const { data } = useQuery({
		queryKey: ['estilo'],
		queryFn: fetchEstilo,
	});

	const theme = createTheme({
		cssVariables: {
			colorSchemeSelector: 'data-toolpad-color-scheme',
		},
		palette: {
			mode: 'light',
			primary: { main: data?.palette.primary?.main ?? '#556cd6' },
			secondary: { main: data?.palette.secondary?.main ?? '#19857b' },
			error: { main: data?.palette.error?.main ?? red.A400 },
		},
		colorSchemes: {
			light: {
				palette: {
					primary: { main: data?.palette.primary?.main ?? '#556cd6' },
					secondary: { main: data?.palette.secondary?.main ?? '#19857b' },
					error: { main: data?.palette.error?.main ?? red.A400 },
				},
			},
			dark: {
				palette: {
					mode: 'dark',
					primary: { main: data?.palette.primary?.main ?? '#90caf9' },
					secondary: { main: data?.palette.secondary?.main ?? '#f48fb1' },
					error: { main: data?.palette.error?.main ?? red.A200 },
					background: { default: '#121212', paper: '#1d1d1d' },
					text: { primary: '#ffffff', secondary: '#bbbbbb' },
				},
			},
		},
	});

	return { theme };
}

// 👉 Componente “interno” que ya asume estar dentro de SessionProvider
function AppInner() {
	const { empresa } = useParams();
	const { theme } = useEstiloTheme();

	const { data: nombreEmpresaData } = useQuery<{ empresa?: string } | string>({
		queryKey: ['nombreEmpresa'],
		queryFn: fetchNombreEmpresa,
	});

	const nombreEmpresa =
		typeof nombreEmpresaData === 'string' ? nombreEmpresaData : nombreEmpresaData?.empresa;

	const branding = React.useMemo(
		() => ({
			logo: <></>,
			title: nombreEmpresa ?? ' ',
		}),
		[nombreEmpresa],
	);

	// 👇 sesión real proveniente de SessionProvider (/api/session)
	const { session, setSession } = useSession();
	const toolpadSession = session as ToolpadSession | null;

	// 👇 Navegación que respeta el prefijo /:empresa
	const navigation = React.useMemo<Navigation>(
		() => [
			{ kind: 'header', title: 'Main items' },
			// Inicio -> /:empresa
			{
				segment: empresa ?? '',
				title: 'Inicio',
				icon: <HomeIcon />,
			},
			// /:empresa/postulaciones
			{
				segment: empresa ? `${empresa}/postulaciones` : 'postulaciones',
				title: 'Mis postulaciones',
				icon: <ContactMailIcon />,
			},
			// /:empresa/perfil-postulante
			{
				segment: empresa ? `${empresa}/perfil-postulante` : 'perfil-postulante',
				title: 'Mi perfil',
				icon: <AccountBoxIcon />,
			},
		],
		[empresa],
	);

	const authentication = React.useMemo(
		() => ({
			signIn: async () => {
				const base = empresa ? `/${empresa}` : '';
				window.location.assign(`${base}/login`);
			},
			signOut: async () => {
				try {
					// Avisamos al backend para que borre la cookie y revoque la sesión
					await logoutPostulante();
				} catch (err) {
					console.error('Error en logoutPostulante:', err);
					// Si falla, igual limpiamos el contexto y redirigimos
				}

				setSession(null);
				const base = empresa ? `/${empresa}` : '';
				window.location.assign(base || '/');
			},
		}),
		[empresa, setSession],
	);

	return (
		<ReactRouterAppProvider
			navigation={navigation}
			session={toolpadSession}
			authentication={authentication}
			branding={branding}
			theme={theme}
		>
			<SnackbarProvider
				maxSnack={3}
				autoHideDuration={6000}
				anchorOrigin={{
					vertical: 'bottom',
					horizontal: 'left',
				}}
			>
				<Outlet />
			</SnackbarProvider>
		</ReactRouterAppProvider>
	);
}

// 👉 Componente que exportás: envuelve todo con SessionProvider
export default function App() {
	return (
		<SessionProvider>
			<AppInner />
		</SessionProvider>
	);
}
