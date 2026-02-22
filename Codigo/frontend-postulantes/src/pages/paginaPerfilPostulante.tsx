import { useSession } from '../SessionContext';
import React, { useEffect, useState } from 'react';
import {
	TextField,
	Button,
	Box,
	Chip,
	CircularProgress,
	Typography,
	MenuItem,
	Alert,
	Snackbar,
} from '@mui/material';
import { damePostulante, actualizarPostulante } from '../api';
import type { Postulante } from '../types';

export default function PaginaPerfilPostulante() {
	const { refreshSession } = useSession();
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [mensaje, setMensaje] = useState<{
		tipo: 'success' | 'error';
		texto: string;
	} | null>(null);

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

	const [habilidadInput, setHabilidadInput] = useState('');
	const MAX_HABILIDAD_LEN = 20;
	const MAX_HABILIDADES = 5;
	const habilidadesLlenas = editPerfil.habilidades.length >= MAX_HABILIDADES;
	const chipColors = ['secondary', 'success', 'info', 'warning', 'error'] as const;

	function normalizarHabilidad(s: string) {
		const limpio = s.trim().replace(/\s+/g, ' ');
		if (!limpio) return '';

		const title = limpio
			.toLowerCase()
			.split(' ')
			.map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ''))
			.join(' ');

		return title.length <= MAX_HABILIDAD_LEN ? title : '';
	}

	function agregarHabilidad(raw: string) {
		const h = normalizarHabilidad(raw);
		if (!h) return;

		setEditPerfil((prev) => {
			if (prev.habilidades.length >= MAX_HABILIDADES) return prev;

			const existe = prev.habilidades.some((x) => x.toLowerCase() === h.toLowerCase());
			if (existe) return prev;

			return {
				...prev,
				habilidades: [...prev.habilidades, h],
			};
		});

		setHabilidadInput('');
	}

	function borrarHabilidad(h: string) {
		setEditPerfil((prev) => ({
			...prev,
			habilidades: prev.habilidades.filter((x) => x !== h),
		}));
	}

	useEffect(() => {
		damePostulante()
			.then((data) => {
				const safeData = {
					...data,
					cuil: data.cuil || '',
					localidad: data.localidad || '',
					telefono: data.telefono || '',
					habilidades: data.habilidades || [],
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

		payload.habilidades = editPerfil.habilidades;

		try {
			await actualizarPostulante(payload);
			await refreshSession();
			setMensaje({ tipo: 'success', texto: 'Datos actualizados correctamente' });
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
				value={editPerfil.fechaNacimiento ? editPerfil.fechaNacimiento.split('T')[0] : ''}
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
			<Box sx={{ mt: 2 }}>
				<TextField
					label='Habilidades'
					value={habilidadInput}
					onChange={(e) => setHabilidadInput(e.target.value)}
					fullWidth
					margin='normal'
					onKeyDown={(e) => {
						if (e.key === 'Enter') {
							e.preventDefault();
							agregarHabilidad(habilidadInput);
						}
					}}
					disabled={habilidadesLlenas}
					helperText={habilidadesLlenas ? `No se puede agregar más habilidades` : ``}
					InputProps={{
						endAdornment: (
							<Button
								onClick={() => agregarHabilidad(habilidadInput)}
								disabled={habilidadesLlenas || !habilidadInput.trim()}
							>
								Agregar
							</Button>
						),
					}}
				/>

				<Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
					{editPerfil.habilidades.map((h, i) => (
						<Chip
							key={h}
							label={h}
							color={chipColors[i % chipColors.length]}
							onDelete={() => borrarHabilidad(h)}
						/>
					))}
				</Box>
			</Box>

			<Button type='submit' variant='contained' color='primary' sx={{ mt: 2 }} disabled={saving}>
				{saving ? 'Guardando...' : 'Guardar cambios'}
			</Button>

			<Snackbar open={!!mensaje} autoHideDuration={6000} onClose={() => setMensaje(null)}>
				<Alert severity={mensaje?.tipo} onClose={() => setMensaje(null)}>
					{mensaje?.texto}
				</Alert>
			</Snackbar>
		</Box>
	);
}
