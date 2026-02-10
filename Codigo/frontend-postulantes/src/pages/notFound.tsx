import React from 'react';
import { Box, Typography, Button, ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const darkTheme = createTheme({
	palette: {
		mode: 'dark',
	},
});

export default function NotFound() {
	const navigate = useNavigate();

	return (
		<ThemeProvider theme={darkTheme}>
			<CssBaseline />
			<Box
				sx={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '100vh',
					width: '100%',
					textAlign: 'center',
					p: 2,
					bgcolor: 'background.default',
					color: 'text.primary',
				}}
			>
				<Typography variant='h2' component='h1' gutterBottom>
					404
				</Typography>
				<Typography variant='h5' component='h2' gutterBottom>
					Página no encontrada
				</Typography>
				<Typography variant='body1' gutterBottom>
					Lo sentimos, la página que buscas no existe.
				</Typography>
				<Button variant='contained' color='primary' onClick={() => navigate('/')}>
					Volver al inicio
				</Button>
			</Box>
		</ThemeProvider>
	);
}
