import * as React from 'react';

import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';

import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

type InputFieldProps = {
	id: string;
	label: string;
	type?: string;
	autoComplete?: string;
	error?: boolean;
	helperText?: string;
	[key: string]: unknown;
};

export const InputField = ({
	id,
	label,
	type = 'text',
	autoComplete,
	error = false,
	helperText = '',
	...props
}: InputFieldProps) => (
	<FormControl>
		<TextField
			id={id}
			label={label}
			type={type}
			autoComplete={autoComplete}
			error={error}
			helperText={helperText}
			fullWidth
			{...props}
		/>
	</FormControl>
);

type PasswordFieldProps = {
	id: string;
	label: string;
	error?: boolean;
	helperText?: string;
	showPassword: boolean;
	handleClickShowPassword: () => void;
	handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
	handleMouseUpPassword: (event: React.MouseEvent<HTMLButtonElement>) => void;
	[key: string]: unknown;
};

export const PasswordField = ({
	id,
	label,
	error = false,
	helperText = '',
	showPassword,
	handleClickShowPassword,
	handleMouseDownPassword,
	handleMouseUpPassword,
	...props
}: PasswordFieldProps) => (
	<FormControl>
		<InputLabel htmlFor={id} error={error}>
			{label} *
		</InputLabel>

		<OutlinedInput
			id={id}
			error={error}
			endAdornment={
				<InputAdornment position='end'>
					<IconButton
						aria-label={showPassword ? 'ocultar la contraseña' : 'mostrar la contraseña'}
						onClick={handleClickShowPassword}
						onMouseDown={handleMouseDownPassword}
						onMouseUp={handleMouseUpPassword}
						edge='end'
					>
						{showPassword ? <VisibilityOff /> : <Visibility />}
					</IconButton>
				</InputAdornment>
			}
			fullWidth
			label={label}
			placeholder='••••••'
			type={showPassword ? 'text' : 'password'}
			{...props}
		/>

		{helperText ? <FormHelperText error={error}>{helperText}</FormHelperText> : null}
	</FormControl>
);
