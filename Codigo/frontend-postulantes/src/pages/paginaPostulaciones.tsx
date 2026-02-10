import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	Alert,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Dialog,
	DialogActions as MUIDialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Skeleton,
	Stack,
	Typography,
} from '@mui/material';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import NotInterestedIcon from '@mui/icons-material/NotInterested';
import { useNavigate, useParams } from 'react-router-dom';

// Internal/project imports
import { darDeBajaPostulacion, damePostulaciones } from '../api';
import type { Postulacion } from '../types';

// --- Helpers ---

function slugify(input: string) {
	return (input ?? '')
		.normalize('NFKD') // separa acentos
		.replace(/[\u0300-\u036f]/g, '') // quita diacríticos
		.replace(/[^a-zA-Z0-9\s-]/g, '') // quita caracteres no deseados
		.trim()
		.replace(/\s+/g, '-') // espacios -> guiones
		.replace(/-+/g, '-') // colapsa guiones
		.toLowerCase();
}

function buildVacantePath(
	empresa: string,
	categoria: string,
	idVacante: number | string,
	titulo: string,
) {
	const tituloSlug = slugify(titulo);

	const categoriaSeg = encodeURIComponent(categoria);

	return `/${encodeURIComponent(empresa)}/${categoriaSeg}/${idVacante}/${tituloSlug}`;
}

function mapEstadoUI(estadoRaw: string) {
	const estado = (estadoRaw ?? '').trim().toUpperCase();

	if (estado === 'P') {
		return {
			label: 'Postulación enviada.',
			color: 'info' as const,
			disableActions: false,
		};
	}
	if (estado === 'C') {
		return {
			label: 'Vacante cerrada.',
			color: 'default' as const,
			disableActions: true,
		};
	}
	return { label: '', color: 'default' as const, disableActions: false };
}

// --- Main Page Component ---

export default function PaginaPostulaciones() {
	const qc = useQueryClient();
	const navigate = useNavigate();

	const { empresa } = useParams<{ empresa: string }>();

	// --- Data Fetching ---
	const { data, isLoading, isError, error } = useQuery<Postulacion[]>({
		queryKey: ['postulaciones'],
		queryFn: damePostulaciones,
	});

	// --- Dialog State ---
	const [open, setOpen] = useState(false);
	const [seleccionada, setSeleccionada] = useState<Postulacion | null>(null);
	const [dialogError, setDialogError] = useState<string | null>(null);

	// --- Mutation ---
	const { mutate: baja, isPending: isBajando } = useMutation({
		mutationFn: darDeBajaPostulacion,
		onSuccess: async () => {
			setOpen(false);
			setSeleccionada(null);
			setDialogError(null);
			await qc.invalidateQueries({ queryKey: ['postulaciones'] });
		},
		onError: (e: Error) => {
			setDialogError(e?.message ?? 'No se pudo completar la operación.');
		},
	});

	// --- Handlers ---
	const pedirBaja = (p: Postulacion) => {
		setSeleccionada(p);
		setDialogError(null);
		setOpen(true);
	};

	const confirmarBaja = () => {
		if (seleccionada) baja(seleccionada.id);
	};

	const handleCloseDialog = () => {
		if (!isBajando) setOpen(false);
	};

	const handleVerPostulacion = (p: Postulacion) => {
		if (!empresa) {
			console.error('No se pudo navegar: falta el parámetro "empresa" en la URL.');
			return;
		}

		const path = buildVacantePath(empresa, p.categoria, p.idVacante, p.titulo);
		navigate(path);
	};

	// --- Render Logic ---
	const renderContent = () => {
		if (isLoading) {
			return (
				<Stack spacing={2}>
					{[1, 2, 3].map((i) => (
						<PostulacionSkeleton key={i} />
					))}
				</Stack>
			);
		}

		if (isError) {
			return (
				<Alert severity='error' sx={{ mb: 2 }}>
					{(error as Error)?.message ?? 'Ocurrió un error'}
				</Alert>
			);
		}

		if (data && data.length === 0) {
			return <EmptyState />;
		}

		if (data && data.length > 0) {
			return (
				<Stack spacing={2}>
					{data.map((p) => (
						<PostulacionCard
							key={p.id}
							postulacion={p}
							onVerVacante={handleVerPostulacion}
							onPedirBaja={pedirBaja}
						/>
					))}
				</Stack>
			);
		}

		return null; // Should not happen
	};

	return (
		<>
			<Typography variant='h4' sx={{ mb: 3 }}>
				Mis postulaciones
			</Typography>

			{renderContent()}

			<ConfirmarBajaDialog
				open={open}
				onClose={handleCloseDialog}
				onConfirm={confirmarBaja}
				isPending={isBajando}
				error={dialogError}
				titulo={seleccionada?.titulo ?? null}
			/>
		</>
	);
}

// --- Child Components ---

/**
 * Displays a single application card.
 */
interface PostulacionCardProps {
	postulacion: Postulacion;
	onVerVacante: (postulacion: Postulacion) => void;
	onPedirBaja: (postulacion: Postulacion) => void;
}

function PostulacionCard({ postulacion: p, onVerVacante, onPedirBaja }: PostulacionCardProps) {
	const ui = mapEstadoUI(p.estado);

	return (
		<Card variant='outlined' sx={{ width: '100%', opacity: ui.disableActions ? 0.7 : 1 }}>
			<CardContent>
				<Typography variant='h6'>{p.titulo}</Typography>
				<Typography variant='subtitle1' color='text.secondary'>
					{p.categoria}
				</Typography>
				<Typography variant='body2' sx={{ mt: 1 }}>
					Postulado el {p.fecha}
				</Typography>

				{ui.label && (
					<Chip
						size='small'
						label={ui.label}
						color={ui.color}
						variant={ui.color === 'default' ? 'outlined' : 'filled'}
						sx={{ mt: 0.75, fontWeight: 600 }}
					/>
				)}
			</CardContent>
			<CardActions>
				<Stack direction='row' justifyContent='flex-end' sx={{ width: '100%' }} spacing={1}>
					<Button
						color='error'
						disabled={ui.disableActions}
						onClick={() => onPedirBaja(p)}
						size='small'
						startIcon={<NotInterestedIcon />}
						variant='contained'
					>
						Dar de baja
					</Button>
					<Button
						disabled={ui.disableActions}
						onClick={() => onVerVacante(p)}
						size='small'
						startIcon={<BusinessCenterIcon />}
						title={ui.disableActions ? 'La vacante está cerrada.' : undefined}
						variant='contained'
					>
						Ver vacante
					</Button>
				</Stack>
			</CardActions>
		</Card>
	);
}

/**
 * Displays a skeleton loading card.
 */
function PostulacionSkeleton() {
	return (
		<Card variant='outlined' sx={{ width: '100%' }}>
			<CardContent>
				<Skeleton variant='text' width='40%' height={28} />
				<Skeleton variant='text' width='30%' />
				<Skeleton variant='text' width='25%' />
			</CardContent>
			<CardActions sx={{ justifyContent: 'flex-end', p: 2 }}>
				<Skeleton variant='rounded' width={120} height={36} sx={{ mr: 1 }} />
				<Skeleton variant='rounded' width={120} height={36} />
			</CardActions>
		</Card>
	);
}

/**
 * Displays a message when no applications are found.
 */
function EmptyState() {
	return (
		<Card variant='outlined'>
			<CardContent>
				<Typography variant='subtitle1' gutterBottom>
					Aún no tenés postulaciones
				</Typography>
				<Typography variant='body2' color='text.secondary'>
					Cuando te postules a una vacante, vas a verla listada acá.
				</Typography>
			</CardContent>
		</Card>
	);
}

/**
 * Displays the confirmation dialog for withdrawing an application.
 */
interface ConfirmarBajaDialogProps {
	open: boolean;
	onClose: () => void;
	onConfirm: () => void;
	isPending: boolean;
	error: string | null;
	titulo: string | null;
}

function ConfirmarBajaDialog({
	open,
	onClose,
	onConfirm,
	isPending,
	error,
	titulo,
}: ConfirmarBajaDialogProps) {
	return (
		<Dialog open={open} onClose={onClose} aria-labelledby='confirm-dialog-title'>
			<DialogTitle id='confirm-dialog-title'>Confirmar baja</DialogTitle>
			<DialogContent>
				<DialogContentText>
					¿Seguro que querés dar de baja tu postulación
					{titulo ? ` a “${titulo}”` : ''}?
				</DialogContentText>
				{error && (
					<Alert severity='error' sx={{ mt: 2 }}>
						{error}
					</Alert>
				)}
			</DialogContent>
			<MUIDialogActions>
				<Button onClick={onClose} disabled={isPending} variant='contained'>
					Cancelar
				</Button>
				<Button
					onClick={onConfirm}
					color='error'
					startIcon={<NotInterestedIcon />}
					variant='contained'
					disabled={isPending}
				>
					{isPending ? 'Dando de baja…' : 'Sí, dar de baja'}
				</Button>
			</MUIDialogActions>
		</Dialog>
	);
}
