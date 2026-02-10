import { useState, useEffect, useRef } from 'react';

import {
	Accordion,
	AccordionDetails,
	AccordionSummary,
	Alert,
	CircularProgress,
	Divider,
	FormControl,
	Grid,
	InputLabel,
	MenuItem,
	Select,
	Stack,
	TextField,
	Typography,
} from '@mui/material';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import { useQuery, useInfiniteQuery, type InfiniteData } from '@tanstack/react-query';

import TarjetaVacante from '../components/TarjetaVacante';
import { dameCategorias, dameVacantes } from '../api';

import type { Vacante, Categoria, DameVacantesResult } from '../types';

interface ListaVacantesProps {
	vacantes: Vacante[];
}

const VACANTES_PAGINA = 20;

function ListaVacantes({ vacantes }: ListaVacantesProps) {
	if (vacantes.length === 0) {
		return (
			<Alert severity='warning' sx={{ textAlign: 'justify', width: '100%' }}>
				No se encontraron vacantes.
			</Alert>
		);
	}

	return (
		<Grid container>
			<Grid size={{ xs: 12, sm: 12, md: 6 }}>
				{vacantes
					.filter((_, index) => index % 2 === 0)
					.map((vacante) => (
						<TarjetaVacante key={vacante.id} {...vacante} />
					))}
			</Grid>
			<Grid size={{ xs: 12, sm: 12, md: 6 }}>
				{vacantes
					.filter((_, index) => index % 2 !== 0)
					.map((vacante) => (
						<TarjetaVacante key={vacante.id} {...vacante} />
					))}
			</Grid>
		</Grid>
	);
}

export default function DashboardPage() {
	const [categoriaSeleccionada, setCategoriaSeleccionada] =
		useState<string>('Todas las categorías');
	const [filtroBusqueda, setFiltroBusqueda] = useState<string>('');

	// Sentinela para el scroll infinito
	const loadMoreRef = useRef<HTMLDivElement | null>(null);

	// Query para obtener la lista de categorías
	const {
		data: categorias,
		isLoading: isLoadingCategorias,
		isError: isErrorCategorias,
	} = useQuery<Categoria[]>({
		queryKey: ['categorias'],
		queryFn: dameCategorias,
	});

	const {
		data: vacantesData,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading: isLoadingVacantes,
		isError: isErrorVacantes,
	} = useInfiniteQuery<
		DameVacantesResult, // TQueryFnData (lo que devuelve dameVacantes por página)
		Error, // TError
		InfiniteData<DameVacantesResult, number>, // TData (lo que te entrega el hook en data)
		[string, { categoriaSeleccionada: string; filtroBusqueda: string }], // TQueryKey
		number // TPageParam
	>({
		queryKey: ['vacantes', { categoriaSeleccionada, filtroBusqueda }],
		queryFn: ({ pageParam = 0 }) =>
			dameVacantes({
				offset: pageParam,
				limit: VACANTES_PAGINA,
				categoria: categoriaSeleccionada,
				titulo: filtroBusqueda,
			}),
		getNextPageParam: (lastPage, allPages) => {
			const fetchedSoFar = allPages.reduce((acc, p) => acc + p.items.length, 0);
			if (fetchedSoFar >= lastPage.itemCount) return undefined;
			return fetchedSoFar;
		},
		initialPageParam: 0,
	});

	const vacantes = vacantesData ? vacantesData.pages.flatMap((p) => p.items) : [];

	// Distinguimos la carga inicial de vacantes
	const isInitialLoadingVacantes = isLoadingVacantes && vacantes.length === 0;

	// IntersectionObserver para scroll infinito
	useEffect(() => {
		if (!hasNextPage) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (entry.isIntersecting && !isFetchingNextPage) {
					fetchNextPage();
				}
			},
			{
				threshold: 1.0, // dispara cuando el sentinela está completamente visible
			},
		);

		const node = loadMoreRef.current;
		if (node) {
			observer.observe(node);
		}

		return () => {
			if (node) {
				observer.unobserve(node);
			}
		};
	}, [hasNextPage, isFetchingNextPage, fetchNextPage]);

	const menuCategorias =
		!isErrorCategorias && categorias && categorias.length > 1 ? (
			<FormControl fullWidth disabled={isLoadingCategorias}>
				<InputLabel id='menuCategorias-label'>Seleccionar categoría</InputLabel>
				<Select
					labelId='menuCategorias-label'
					id='menuCategorias'
					value={categoriaSeleccionada}
					label='Seleccionar categoría'
					onChange={(e) => setCategoriaSeleccionada(e.target.value)}
				>
					<MenuItem value='Todas las categorías'>Todas las categorías</MenuItem>
					{categorias.map((option) => (
						<MenuItem key={option.idCategoria} value={option.categoria}>
							{option.categoria}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		) : null;

	return (
		<Stack direction='column' divider={<Divider orientation='horizontal' flexItem />} spacing={2}>
			{/* Si hubo error de categorías, lo mostramos arriba, pero no rompemos toda la página */}
			{isErrorCategorias && (
				<Alert severity='error'>Ocurrió un error al obtener la lista de categorías.</Alert>
			)}

			<Accordion>
				<AccordionSummary
					aria-controls='panel1-content'
					expandIcon={<ArrowDownwardIcon />}
					id='panel1-header'
				>
					<Typography component='span'>Filtrar vacantes</Typography>
				</AccordionSummary>
				<AccordionDetails>
					<Grid container spacing={2}>
						<Grid size={{ xs: 12, sm: 6 }}>{menuCategorias}</Grid>
						<Grid size={{ xs: 12, sm: 6 }}>
							<TextField
								fullWidth
								id='filtroBusqueda'
								label='Buscar vacante'
								value={filtroBusqueda}
								onChange={(e) => setFiltroBusqueda(e.target.value)}
							/>
						</Grid>
					</Grid>
				</AccordionDetails>
			</Accordion>

			{/* Zona de tarjetas de vacantes */}
			{isErrorVacantes ? (
				<Alert severity='error'>Ocurrió un error al obtener las vacantes.</Alert>
			) : isInitialLoadingVacantes ? (
				<Grid container justifyContent='center' sx={{ mt: 2 }}>
					<CircularProgress />
				</Grid>
			) : (
				<>
					<ListaVacantes vacantes={vacantes} />

					{/* Sentinela para scroll infinito + spinner al final */}
					<div
						ref={loadMoreRef}
						style={{
							display: 'flex',
							justifyContent: 'center',
							alignItems: 'center',
							marginTop: 16,
							minHeight: hasNextPage ? 48 : 0,
						}}
					>
						{hasNextPage && isFetchingNextPage && <CircularProgress />}
					</div>
				</>
			)}
		</Stack>
	);
}
