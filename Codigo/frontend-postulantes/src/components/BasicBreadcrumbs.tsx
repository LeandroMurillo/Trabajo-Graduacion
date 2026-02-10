import React, { FC } from 'react';

import Typography from '@mui/material/Typography';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';

interface BasicBreadcrumbsProps {
	categoriaNombre: string;
	tituloVacancia: string;
}

const handleClick = (event: React.MouseEvent<HTMLDivElement>): void => {
	event.preventDefault();
	console.info('You clicked a breadcrumb.');
};

const BasicBreadcrumbs: FC<BasicBreadcrumbsProps> = (props) => {
	return (
		<div role='presentation' onClick={handleClick}>
			<Breadcrumbs aria-label='breadcrumb'>
				<Link underline='hover' color='inherit' href='/'>
					Home
				</Link>
				<Link underline='hover' color='inherit' href='/material-ui/getting-started/installation/'>
					{props.categoriaNombre}
				</Link>
				<Typography sx={{ color: 'text.primary' }}>{props.tituloVacancia}</Typography>
			</Breadcrumbs>
		</div>
	);
};

export default BasicBreadcrumbs;
