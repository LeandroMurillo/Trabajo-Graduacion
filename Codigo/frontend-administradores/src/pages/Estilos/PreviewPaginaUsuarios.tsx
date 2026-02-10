// src/pages/estilos/PreviewPaginaUsuarios.tsx
import * as React from 'react';
import { Alert, Box, Button, Stack, TextField, Typography } from '@mui/material';

export default function PreviewPaginaUsuarios() {
	return (
		<Box sx={{ p: 2 }}>
			<Stack spacing={2}>
				<Typography variant='h5'>Vista previa (sitio de usuarios)</Typography>

				<Stack direction='row' spacing={1}>
					<Button variant='contained'>Botón principal</Button>
					<Button variant='outlined'>Outlined</Button>
					<Button variant='text'>Link</Button>
				</Stack>

				<Stack direction='row' spacing={1} flexWrap='wrap' useFlexGap>
					<Button color='secondary' variant='contained'>
						Secundario
					</Button>
					<Button color='success' variant='contained'>
						Éxito
					</Button>
					<Button color='error' variant='contained'>
						Error
					</Button>
				</Stack>

				<TextField label='Buscar vacantes…' fullWidth />
				<TextField label='Campo con error' fullWidth error helperText='Ejemplo de error' />

				<Alert severity='info'>Esto es un Alert info</Alert>
				<Alert severity='success'>Esto es un Alert success</Alert>
				<Alert severity='error'>Esto es un Alert error</Alert>

				<Box
					sx={{
						p: 2,
						borderRadius: 2,
						bgcolor: 'background.paper',
						boxShadow: 1,
					}}
				>
					<Typography variant='h6'>Card / Vacante</Typography>
					<Typography variant='body2' color='text.secondary'>
						Descripción corta para ver tipografía y colores.
					</Typography>
				</Box>
			</Stack>
		</Box>
	);
}
