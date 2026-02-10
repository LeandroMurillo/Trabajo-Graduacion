import { useNavigate, useParams } from 'react-router-dom';

import Card from '@mui/material/Card';
import CardActionArea from '@mui/material/CardActionArea';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CategoryIcon from '@mui/icons-material/Category';
import Markdown from 'react-markdown';

import type { Vacante } from '../types';

export default function TarjetaVacante(props: Vacante) {
	function cantidadDiasPublicacion(fecha: string | null): string {
		if (!fecha) return 'Sin fecha';
		const fechaPublicacion: Date = new Date(fecha);
		const fechaActual: Date = new Date();
		const diferenciaTiempo: number = fechaActual.valueOf() - fechaPublicacion.valueOf();
		const diferenciaDias: number = Math.floor(diferenciaTiempo / (1000 * 60 * 60 * 24));

		if (diferenciaDias === 0) {
			return 'publicado hoy';
		}
		if (diferenciaDias === 1) {
			return 'publicado ayer';
		}
		return `publicado hace ${diferenciaDias} días`;
	}

	function mostrarPrimeros100Caracteres(texto: string | null): string {
		if (!texto) return '';
		if (texto.length <= 200) {
			return texto;
		}
		return texto.substring(0, 200) + '...';
	}

	const navigate = useNavigate();
	const { empresa } = useParams();

	const handleClick = () => {
		const base = empresa ? `/${empresa}` : '';
		navigate(`${base}/${props.categoria}/${props.id}/${encodeURIComponent(props.titulo)}`);
	};

	return (
		<Card sx={{ marginRight: 1, marginBottom: 1 }}>
			<CardActionArea LinkComponent='a' onClick={handleClick}>
				<CardContent>
					<Stack direction='row' spacing={1} sx={{ marginBottom: 2 }}>
						<CategoryIcon />
						<Typography sx={{ fontWeight: 'light' }}>{props.categoria}</Typography>
					</Stack>

					<Typography variant='h5'>{props.titulo}</Typography>

					<Typography sx={{ textAlign: 'justify' }}>
						<Markdown>{mostrarPrimeros100Caracteres(props.descripcion)}</Markdown>
					</Typography>

					<Stack direction='row' spacing={1} sx={{ marginTop: 2 }}>
						<AccessTimeIcon />
						<Typography sx={{ fontWeight: 'light' }}>
							{cantidadDiasPublicacion(props.fechaPublicacion)}
						</Typography>
					</Stack>
				</CardContent>
			</CardActionArea>
		</Card>
	);
}
