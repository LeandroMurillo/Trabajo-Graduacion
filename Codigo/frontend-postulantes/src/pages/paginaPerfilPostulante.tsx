import React, { useEffect, useState } from 'react';
import {
	TextField,
	Button,
	Box,
	CircularProgress,
	Typography,
	MenuItem,
	Alert,
	Snackbar,
} from '@mui/material';
import { damePostulante, actualizarPostulante } from '../api';
import type { Postulante } from '../types';

export default function PaginaPerfilPostulante() {
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [mensaje, setMensaje] = useState<{
		tipo: 'success' | 'error';
		texto: string;
	} | null>(null);

	// Inicializamos con strings vacíos para evitar "uncontrolled input" warnings
	const [editPerfil, setEditPerfil] = useState<Postulante>({
		nombres: '',
		apellidos: '',
		email: '',
		cuil: '',
		genero: '',
		fechaNacimiento: '',
		localidad: '',
		telefono: '',
		habilidades: [],
	});

	const generos = [
		{
			value: 'M',
			label: 'Masculino',
		},
		{
			value: 'F',
			label: 'Femenino',
		},
		{
			value: 'X',
			label: 'Prefiero no decirlo',
		},
	];

	useEffect(() => {
		damePostulante()
			.then((data) => {
				// Convertimos nulls a strings vacíos para manejo seguro en el form
				const safeData = {
					...data,
					cuil: data.cuil || '',
					localidad: data.localidad || '',
					telefono: data.telefono || '',
					habilidades: data.habilidades || [],
					// Si la fecha viene como ISO string, la dejamos así para que el input type="date" la lea,
					// o si viene vacía la dejamos vacía.
				};
				setEditPerfil(safeData);
				setLoading(false);
			})
			.catch(() => {
				setMensaje({ tipo: 'error', texto: 'Error al cargar el perfil' });
				setLoading(false);
			});
	}, []);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setEditPerfil({ ...editPerfil, [e.target.name]: e.target.value });
	};

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setMensaje(null);

		// Preparar payload para el backend
		// 1. Copiamos el estado actual
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		const payload: any = { ...editPerfil };

		// 2. Formatear la fecha a DD-MM-AAAA
		if (payload.fechaNacimiento) {
			// Extraemos solo "YYYY-MM-DD" ignorando el tiempo (T00:00...)
			const dateOnly = payload.fechaNacimiento.split('T')[0];
			const parts = dateOnly.split('-');

			if (parts.length === 3) {
				const [y, m, d] = parts;
				// Ahora sí: d='11', m='11', y='1976'
				payload.fechaNacimiento = `${d.padStart(2, '0')}-${m.padStart(2, '0')}-${y}`;
			}
		}

		// 3. Limpiar campos vacíos o nulos
		// El esquema Zod es .partial(), así que si no enviamos una clave, no la valida.
		// Pero si enviamos "cuil": "" (vacío), fallará porque espera longitud 11.
		// Por eso, eliminamos las claves vacías.
		Object.keys(payload).forEach((key) => {
			if (payload[key] === '' || payload[key] === null || payload[key] === undefined) {
				delete payload[key];
			}
		});

		// 4. Habilidades: El backend espera string, pero en frontend manejamos array o string
		if (Array.isArray(editPerfil.habilidades)) {
			// Si el usuario no editó, podría seguir siendo array. Lo convertimos.
			// Si tu backend espera un string simple, lo unimos.
			// OJO: Tu esquema dice z.string(), asegúrate de qué formato espera.
			// Si espera CSV:
			payload.habilidades = editPerfil.habilidades.join(', ');
		}

		try {
			await actualizarPostulante(payload);
			setMensaje({ tipo: 'success', texto: 'Datos actualizados correctamente' });
			// Opcional: recargar datos reales para confirmar
		} catch (error) {
			console.error(error);
			setMensaje({ tipo: 'error', texto: 'Error al guardar los cambios' });
		} finally {
			setSaving(false);
		}
	};

	if (loading) {
		return (
			<Box display='flex' justifyContent='center' alignItems='center' minHeight='200px'>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box
			component='form'
			onSubmit={handleSubmit}
			sx={{
				bgcolor: 'background.paper',
				color: 'text.primary',
				maxWidth: 400,
				mx: 'auto',
				mt: 4,
				p: 4,
				borderRadius: 2,
				boxShadow: 3,
			}}
		>
			<Typography variant='h5' mb={2}>
				Perfil del Postulante
			</Typography>

			<TextField
				label='Nombres'
				name='nombres'
				value={editPerfil.nombres}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Apellidos'
				name='apellidos'
				value={editPerfil.apellidos}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Email'
				name='email'
				type='email'
				value={editPerfil.email}
				onChange={handleChange}
				fullWidth
				margin='normal'
				disabled
			/>
			<TextField
				label='Cuil'
				name='cuil'
				value={editPerfil.cuil}
				onChange={handleChange}
				fullWidth
				margin='normal'
				helperText='Debe tener 11 dígitos'
			/>
			<TextField
				select
				label='Género'
				name='genero'
				value={editPerfil.genero}
				onChange={handleChange}
				fullWidth
				margin='normal'
			>
				{generos.map((opcion) => (
					<MenuItem key={opcion.value} value={opcion.value}>
						{opcion.label}
					</MenuItem>
				))}
			</TextField>
			<TextField
				label='Fecha de Nacimiento'
				name='fechaNacimiento'
				type='date'
				// Convertimos la fecha completa ISO a YYYY-MM-DD para el input
				value={
					editPerfil.fechaNacimiento
						? editPerfil.fechaNacimiento.split('T')[0]
						: ''
				}
				onChange={handleChange}
				fullWidth
				margin='normal'
				InputLabelProps={{ shrink: true }}
			/>
			<TextField
				label='Localidad'
				name='localidad'
				value={editPerfil.localidad}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Teléfono'
				name='telefono'
				type='tel'
				value={editPerfil.telefono}
				onChange={handleChange}
				fullWidth
				margin='normal'
			/>
			<TextField
				label='Habilidades'
				name='habilidades'
				value={editPerfil.habilidades}
				onChange={handleChange}
				fullWidth
				margin='normal'
				disabled // TODO: no funca
			/>

			<Button
				type='submit'
				variant='contained'
				color='primary'
				sx={{ mt: 2 }}
				disabled={saving}
			>
				{saving ? 'Guardando...' : 'Guardar cambios'}
			</Button>

			<Snackbar
				open={!!mensaje}
				autoHideDuration={6000}
				onClose={() => setMensaje(null)}
			>
				<Alert severity={mensaje?.tipo} onClose={() => setMensaje(null)}>
					{mensaje?.texto}
				</Alert>
			</Snackbar>
		</Box>
	);
}
