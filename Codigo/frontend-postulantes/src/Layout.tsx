import * as React from 'react';
import { Outlet, useMatches, useParams } from 'react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';

import type { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { Account, AccountPreview, type AccountPreviewProps } from '@toolpad/core/Account';

import { useSession } from './SessionContext';

// Definición de tipo para evitar 'any' en matches
interface RouteHandle {
	title?: string | ((match: RouteMatch) => string);
}

interface RouteMatch {
	id: string;
	pathname: string;
	params: Record<string, string | undefined>;
	data: unknown;
	handle: unknown;
}

const Fondo = styled(Stack)(({ theme }) => ({
	'&::before': {
		content: '""',
		display: 'block',
		position: 'fixed',
		zIndex: -1,
		inset: 0,
		backgroundImage: 'linear-gradient(hsl(210, 100%, 97%), hsl(0, 0%, 100%))',
		backgroundRepeat: 'no-repeat',
		...theme.applyStyles('dark', {
			backgroundImage: 'linear-gradient(hsla(210, 100%, 16%, 0.5), hsl(220, 30%, 5%))',
		}),
	},
}));

function AccountSidebarPreview(props: AccountPreviewProps & { mini: boolean }) {
	const { handleClick, open, mini } = props;

	return (
		<AccountPreview
			variant={mini ? 'condensed' : 'expanded'}
			handleClick={handleClick}
			open={open}
			slots={{ avatar: () => null }}
		/>
	);
}

function createPreviewComponent(mini: boolean) {
	function PreviewComponent(props: AccountPreviewProps) {
		return <AccountSidebarPreview {...props} mini={mini} />;
	}

	return PreviewComponent;
}

function CustomToolbarActions({ mini }: SidebarFooterProps) {
	const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);
	const { loading } = useSession();

	return (
		<Stack direction='row' alignItems='center' spacing={1}>
			{loading ? (
				// Reservamos espacio para evitar salto visual mientras se restaura sesión
				<Box sx={{ width: mini ? 0 : 220, height: 32 }} />
			) : (
				<Account
					localeText={{
						accountSignInLabel: 'Iniciar sesión',
						accountSignOutLabel: 'Cerrar sesión',
					}}
					slots={{ preview: PreviewComponent }}
					slotProps={{
						signInButton: { sx: { display: mini ? 'none' : 'block' } },
					}}
				/>
			)}
			<ThemeSwitcher />
		</Stack>
	);
}

export default function Layout() {
	const matches = useMatches();
	const { empresa } = useParams();
	const { loading } = useSession();

	const homeUrl = empresa ? `/${empresa}` : '/';

	React.useEffect(() => {
		const matchWithTitle = [...matches].reverse().find((m) => {
			const h = m.handle as RouteHandle | undefined;
			return Boolean(h?.title);
		});

		const h = matchWithTitle?.handle as RouteHandle | undefined;

		let pageTitle = 'Plataforma';
		if (h?.title && matchWithTitle) {
			pageTitle =
				typeof h.title === 'function' ? h.title(matchWithTitle as unknown as RouteMatch) : h.title;
		}

		document.title = pageTitle;
	}, [matches]);

	if (loading) {
		// Evita el flash de "Iniciar sesión" y de contenido protegido
		return <Fondo sx={{ minHeight: '100vh' }} />;
	}

	return (
		<Fondo>
			<DashboardLayout
				sidebarExpandedWidth={240}
				defaultSidebarCollapsed
				branding={{ homeUrl }}
				slots={{
					toolbarActions: () => <CustomToolbarActions mini={false} />,
				}}
			>
				<PageContainer
					slots={{
						header: () => <></>,
					}}
				>
					<Outlet />
				</PageContainer>
			</DashboardLayout>
		</Fondo>
	);
}
