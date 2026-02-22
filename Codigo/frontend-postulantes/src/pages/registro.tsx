import { useState, type FormEvent, type MouseEvent, type ChangeEvent } from 'react';
import 'dayjs/locale/es';

// --- External Libraries ---
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router';
import dayjs, { type Dayjs } from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';

// --- MUI Components ---
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import MuiCard from '@mui/material/Card';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Link from '@mui/material/Link';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// --- MUI-X (Date Picker) ---
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { esES } from '@mui/x-date-pickers/locales';

// --- Internal Imports ---
import { InputField, PasswordField } from '../components/Entradas';
import { registrarPostulante } from '../firebase/auth'; // <- antes: altaPostulante
import { useSnackbar } from 'notistack';

// --- Types ---
interface FormularioRegistroData {
	nombres: string;
	apellidos: string;
	email: string;
	contraseña: string;
	fechaNacimiento: string; // formato: YYYY-MM-DD
	genero: string; // M, F, X
}

interface FormValues {
	nombres: string;
	apellidos: string;
	email: string;
	contraseña: string;
	verifyPassword: string;
	fechaNacimiento: Dayjs | null;
	genero: string;
}

type FormErrors = {
	[key in keyof FormValues]?: string;
};

// --- Constants & Helpers ---
const generos = [
	{ value: 'F', label: 'Femenino' },
	{ value: 'M', label: 'Masculino' },
	{ value: 'X', label: 'Prefiero no decirlo' },
];

const Card = styled(MuiCard)(({ theme }) => ({
	display: 'flex',
	flexDirection: 'column',
	alignSelf: 'center',
	width: '100%',
	padding: theme.spacing(4),
	gap: theme.spacing(2),
	margin: 'auto',
	overflow: 'scroll',
	boxShadow:
		'hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px',
	[theme.breakpoints.up('sm')]: {
		width: '450px',
	},
	...theme.applyStyles('dark', {
		boxShadow:
			'hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px',
	}),
}));

// Configure dayjs globally
dayjs.extend(updateLocale);
dayjs.updateLocale('es', {
	weekStart: 0,
});

/**
 * Validates the form values and returns an error object.
 */
function validateForm(values: FormValues): FormErrors {
	const newErrors: FormErrors = {};
	const today = dayjs();

	if (
		!values.email ||
		!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(values.email.trim())
	) {
		newErrors.email = 'Ingresa un correo válido.';
	}

	if (!values.contraseña || values.contraseña.trim().length < 6) {
		newErrors.contraseña = 'La contraseña tiene por lo menos 6 caracteres.';
	}

	if (!values.verifyPassword || values.verifyPassword !== values.contraseña) {
		newErrors.verifyPassword = 'Las contraseñas no coinciden.';
	}

	if (!values.nombres || !/^[ A-Za-zÀ-ÖØ-öø-ÿ'-]{2,}$/.test(values.nombres.trim())) {
		newErrors.nombres = 'Ingresa un nombre.';
	}

	if (!values.apellidos || !/^[ A-Za-zÀ-ÖØ-öø-ÿ'-]{2,}$/.test(values.apellidos.trim())) {
		newErrors.apellidos = 'Ingresa un apellido.';
	}

	if (
		!values.fechaNacimiento ||
		!values.fechaNacimiento.isValid() ||
		values.fechaNacimiento.isAfter(today) ||
		values.fechaNacimiento.isBefore('1900-01-01')
	) {
		newErrors.fechaNacimiento = 'Fecha inválida.';
	}

	if (!values.genero || !['M', 'F', 'X'].includes(values.genero)) {
		newErrors.genero = 'Completa este campo.';
	}

	return newErrors;
}

// --- Component ---
export default function Registro() {
	const navigate = useNavigate();
	const { empresa } = useParams();

	const [values, setValues] = useState<FormValues>({
		nombres: '',
		apellidos: '',
		email: '',
		contraseña: '',
		verifyPassword: '',
		fechaNacimiento: null,
		genero: '',
	});

	const [errors, setErrors] = useState<FormErrors>({});
	const [showPassword, setShowPassword] = useState(false);

	const { enqueueSnackbar } = useSnackbar();

	const mutation = useMutation({
		mutationFn: registrarPostulante,
		onSuccess: () => {
			enqueueSnackbar('Registro exitoso. Revisa tu correo para verificar tu cuenta.', {
				variant: 'success',
			});

			const base = empresa ? `/${empresa}` : '';
			navigate(`${base}/login`);
		},
		onError: (error: Error) => {
			enqueueSnackbar(error.message || 'Ocurrió un error.', {
				variant: 'error',
			});
		},
	});

	function handleChange(e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;

		setValues((prev) => ({
			...prev,
			[name]: value,
		}));

		if (errors[name as keyof FormErrors]) {
			setErrors((prev) => ({
				...prev,
				[name]: undefined,
			}));
		}
	}

	function handleDateChange(newValue: Dayjs | null) {
		setValues((prev) => ({
			...prev,
			fechaNacimiento: newValue,
		}));

		if (errors.fechaNacimiento) {
			setErrors((prev) => ({
				...prev,
				fechaNacimiento: undefined,
			}));
		}
	}

	function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();

		const newErrors = validateForm(values);
		setErrors(newErrors);

		if (Object.keys(newErrors).length > 0) {
			return;
		}

		const newUser: FormularioRegistroData = {
			nombres: values.nombres.trim(),
			apellidos: values.apellidos.trim(),
			email: values.email.trim(),
			contraseña: values.contraseña.trim(),
			fechaNacimiento: values.fechaNacimiento!.format('YYYY-MM-DD'),
			genero: values.genero,
		};

		mutation.mutate(newUser);
	}

	// --- Password Field Handlers ---
	function handleClickShowPassword() {
		setShowPassword((show) => !show);
	}

	function handleMouseDownPassword(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
	}

	function handleMouseUpPassword(event: MouseEvent<HTMLButtonElement>) {
		event.preventDefault();
	}

	function handleIrALogin() {
		const base = empresa ? `/${empresa}` : '';
		navigate(`${base}/login`);
	}

	return (
		<Stack direction='column' justifyContent='space-between'>
			<Card variant='outlined'>
				<Typography
					component='h1'
					sx={{ width: '100%', fontSize: 'clamp(2rem, 10vw, 2.15rem)' }}
					variant='h4'
				>
					Regístrate
				</Typography>

				<Box
					component='form'
					onSubmit={handleSubmit}
					noValidate
					sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
				>
					<InputField
						autoComplete='name'
						error={!!errors.nombres}
						helperText={errors.nombres ?? ''}
						id='nombres'
						label='Nombre(s)'
						name='nombres'
						onChange={handleChange}
						value={values.nombres}
						required
					/>

					<InputField
						autoComplete='apellido'
						error={!!errors.apellidos}
						helperText={errors.apellidos ?? ''}
						id='apellido'
						label='Apellido(s)'
						name='apellidos'
						onChange={handleChange}
						value={values.apellidos}
						required
					/>

					<InputField
						autoComplete='email'
						error={!!errors.email}
						helperText={errors.email ?? ''}
						id='email'
						label='Correo electrónico'
						name='email'
						onChange={handleChange}
						value={values.email}
						required
					/>

					<PasswordField
						error={!!errors.contraseña}
						handleClickShowPassword={handleClickShowPassword}
						handleMouseDownPassword={handleMouseDownPassword}
						handleMouseUpPassword={handleMouseUpPassword}
						helperText={errors.contraseña ?? ''}
						id='password'
						label='Contraseña'
						name='contraseña'
						onChange={handleChange}
						value={values.contraseña}
						required
						showPassword={showPassword}
					/>

					<PasswordField
						error={!!errors.verifyPassword}
						handleClickShowPassword={handleClickShowPassword}
						handleMouseDownPassword={handleMouseDownPassword}
						handleMouseUpPassword={handleMouseUpPassword}
						helperText={errors.verifyPassword ?? ''}
						id='verifyPassword'
						label='Verifica tu contraseña'
						name='verifyPassword'
						onChange={handleChange}
						value={values.verifyPassword}
						required
						showPassword={showPassword}
					/>

					<FormControl fullWidth error={!!errors.genero}>
						<TextField
							id='genero'
							label='Género'
							name='genero'
							onChange={handleChange}
							required
							select
							value={values.genero}
						>
							{generos.map((option) => (
								<MenuItem key={option.value} value={option.value}>
									{option.label}
								</MenuItem>
							))}
						</TextField>
						{errors.genero && <FormHelperText>{errors.genero}</FormHelperText>}
					</FormControl>

					<LocalizationProvider
						adapterLocale='es'
						dateAdapter={AdapterDayjs}
						localeText={esES.components.MuiLocalizationProvider.defaultProps.localeText}
					>
						<DatePicker
							disableFuture
							disableHighlightToday
							format='DD-MM-YYYY'
							label='Fecha de nacimiento'
							maxDate={dayjs()}
							onChange={handleDateChange}
							openTo='year'
							value={values.fechaNacimiento}
							views={['year', 'month', 'day']}
							slotProps={{
								textField: {
									error: !!errors.fechaNacimiento,
									helperText: errors.fechaNacimiento,
									required: true,
								},
							}}
						/>
					</LocalizationProvider>

					{mutation.isError && !mutation.isPending && (
						<FormHelperText error>{(mutation.error as Error).message}</FormHelperText>
					)}

					<Button fullWidth type='submit' variant='contained' disabled={mutation.isPending}>
						{mutation.isPending ? 'Procesando...' : 'Continuar'}
					</Button>

					<Typography sx={{ textAlign: 'center' }}>
						Ya estás registrado?{' '}
						<Link
							component='button'
							type='button'
							onClick={handleIrALogin}
							variant='body2'
							sx={{ alignSelf: 'center' }}
						>
							Iniciar sesión
						</Link>
					</Typography>
				</Box>
			</Card>
		</Stack>
	);
}
