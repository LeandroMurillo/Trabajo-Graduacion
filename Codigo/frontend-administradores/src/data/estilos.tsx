// src/data/estilos.ts
import type { DataSource } from '@toolpad/core/Crud';
import { Stack, TextField, Typography } from '@mui/material';

export type Estilos = {
	id: string;
	primaryColor: string; // HEX: #RRGGBB
};

export const estilosDataSource: DataSource<Estilos> = {
	fields: [
		{
			field: 'primaryColor',
			headerName: 'Color primario',
			flex: 1,
			renderFormField: ({ value, onChange, error }) => {
				const hex = (value as string) ?? '#1976d2';

				return (
					<Stack direction='row' spacing={2} alignItems='center'>
						<Typography variant='body1'>Color primario:</Typography>

						<TextField
							type='color'
							value={hex}
							onChange={(e) => onChange(e.target.value)}
							error={Boolean(error)}
							sx={{ width: 90 }}
						/>
					</Stack>
				);
			},
		},
	],
};
