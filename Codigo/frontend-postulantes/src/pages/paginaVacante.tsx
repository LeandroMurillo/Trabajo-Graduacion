import * as React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import Markdown from 'react-markdown';
import { useTheme } from '@mui/material/styles';

import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
import WorkOutlineOutlinedIcon from '@mui/icons-material/WorkOutlineOutlined';
import HomeWorkOutlinedIcon from '@mui/icons-material/HomeWorkOutlined';
import TaskAltRoundedIcon from '@mui/icons-material/TaskAltRounded';

import DialogPostularse from '../components/DialogPostularse';
import { dameVacante } from '../api';
import type { Vacante } from '../types';

export default function PaginaVacante() {
	const navigate = useNavigate();
	const { pIdVacante } = useParams<{ pIdVacante: string }>();
	const theme = useTheme();

	const idNum = React.useMemo(() => {
		const n = Number.parseInt(String(pIdVacante ?? ''), 10);
		return Number.isFinite(n) && n > 0 ? n : null;
	}, [pIdVacante]);

	const { data, isLoading, isError, error } = useQuery({
		queryKey: ['vacante', idNum],
		queryFn: () => dameVacante(idNum as number),
		enabled: idNum != null,
	});

	const [openDialog, setOpenDialog] = React.useState(false);

	if (idNum == null) {
		return <Alert severity='error'>ID de vacante inválido.</Alert>;
	}

	if (isLoading) return <CircularProgress />;
	if (isError) {
		return (
			<Alert severity='error'>{(error as Error)?.message ?? 'Error al obtener la vacante.'}</Alert>
		);
	}
	if (!data) return <Alert severity='warning'>Vacante no encontrada.</Alert>;

	const vacante: Vacante = data;

	// === Estilos adaptativos ===
	const chipBg = theme.palette.mode === 'dark' ? 'grey.800' : 'grey.100';
	const chipBorder = theme.palette.mode === 'dark' ? 'grey.700' : 'grey.300';
	const chipText = theme.palette.mode === 'dark' ? 'grey.100' : 'grey.800';
	const chipIcon = theme.palette.mode === 'dark' ? 'grey.300' : 'grey.700';

	return (
		<Box
			sx={{
				width: '100%',
				minHeight: 'calc(100vh - 64px)',
				display: 'flex',
				flexDirection: 'column',
				backgroundColor: theme.palette.mode === 'dark' ? 'grey.900' : 'grey.100',
				p: 0,
			}}
		>
			<Paper
				elevation={4}
				sx={{
					flex: 1,
					m: 0,
					borderRadius: 0,
					p: { xs: 3, md: 5 },
					display: 'flex',
					flexDirection: 'column',
					overflowY: 'auto',
				}}
			>
				<Stack direction='row' alignItems='center' spacing={1} sx={{ mb: 1 }}>
					<IconButton onClick={() => navigate(-1)} size='small'>
						<ArrowBackIosNewRoundedIcon fontSize='small' />
					</IconButton>
					<Typography variant='overline' color='text.secondary'>
						{vacante.categoria}
					</Typography>
				</Stack>

				<Typography variant='h4' sx={{ fontWeight: 700 }}>
					{vacante.titulo}
				</Typography>

				<Chip
					icon={<LocationOnOutlinedIcon />}
					label={vacante.localidad ?? '—'}
					variant='outlined'
					sx={{
						alignSelf: 'flex-start',
						mt: 1,
						mb: 2,
						bgcolor: chipBg,
						color: chipText,
						borderColor: chipBorder,
						'& .MuiChip-icon': { color: chipIcon },
					}}
				/>

				<Divider sx={{ my: 2 }} />

				<Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 1 }}>
					<Chip
						icon={<CalendarMonthOutlinedIcon />}
						label={formatFechaPublicacion(vacante.fechaPublicacion)}
						variant='outlined'
						sx={{
							bgcolor: chipBg,
							color: chipText,
							borderColor: chipBorder,
							'& .MuiChip-icon': { color: chipIcon },
						}}
					/>
					<Chip
						icon={<WorkOutlineOutlinedIcon />}
						label={vacante.tipoTrabajo || '—'}
						variant='outlined'
						sx={{
							bgcolor: chipBg,
							color: chipText,
							borderColor: chipBorder,
							'& .MuiChip-icon': { color: chipIcon },
						}}
					/>
					<Chip
						icon={<HomeWorkOutlinedIcon />}
						label={vacante.modalidad || '—'}
						variant='outlined'
						sx={{
							bgcolor: chipBg,
							color: chipText,
							borderColor: chipBorder,
							'& .MuiChip-icon': { color: chipIcon },
						}}
					/>
				</Stack>

				<Typography component='div' sx={{ '& p': { mb: 1.2 } }}>
					<Markdown>{vacante.descripcion || ''}</Markdown>
				</Typography>

				<Typography variant='subtitle1' sx={{ mt: 3, mb: 1, fontWeight: 600 }}>
					Habilidades requeridas
				</Typography>

				<Stack direction='row' spacing={1} flexWrap='wrap' sx={{ mb: 2 }}>
					{(vacante.habilidades ?? [])
						.map((h) => String(h).trim())
						.filter(Boolean)
						.map((h, i) => (
							<Chip
								key={`${h}-${i}`}
								label={h}
								sx={{
									bgcolor: chipBg,
									color: chipText,
									borderColor: chipBorder,
									'& .MuiChip-icon': { color: chipIcon },
								}}
								variant='outlined'
							/>
						))}

					{(vacante.habilidades?.length ?? 0) === 0 && (
						<Typography variant='body2' color='text.secondary'>
							—
						</Typography>
					)}
				</Stack>

				<Divider sx={{ my: 2 }} />

				<Stack direction='row' justifyContent='flex-end' sx={{ mt: 'auto' }}>
					<Button
						variant='contained'
						startIcon={<TaskAltRoundedIcon />}
						size='large'
						onClick={() => setOpenDialog(true)}
					>
						POSTULARME
					</Button>
				</Stack>
			</Paper>

			<DialogPostularse open={openDialog} onClose={() => setOpenDialog(false)} />
		</Box>
	);
}

function formatFechaPublicacion(fechaISO?: string | null) {
	if (!fechaISO) return 'Publicado: —';

	const d = new Date(fechaISO);
	if (Number.isNaN(d.getTime())) return 'Publicado: —';

	return `Publicado: ${d.toLocaleDateString('es-AR', {
		day: '2-digit',
		month: '2-digit',
		year: 'numeric',
	})}`;
}
