import * as React from 'react';
import { Outlet, useMatches, useParams } from 'react-router';
import { DashboardLayout, ThemeSwitcher } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import { SidebarFooterProps } from '@toolpad/core/DashboardLayout';
import { Account, AccountPreview, AccountPreviewProps } from '@toolpad/core/Account';

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

const createPreviewComponent = (mini: boolean) => {
	function PreviewComponent(props: AccountPreviewProps) {
		return <AccountSidebarPreview {...props} mini={mini} />;
	}
	return PreviewComponent;
};

function CustomToolbarActions({ mini }: SidebarFooterProps) {
	const PreviewComponent = React.useMemo(() => createPreviewComponent(mini), [mini]);

	return (
		<Stack direction='row' alignItems='center'>
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
			<ThemeSwitcher />
		</Stack>
	);
}

export default function Layout() {
	const matches = useMatches();
	const { empresa } = useParams();

	const homeUrl = empresa ? `/${empresa}` : '/';

	React.useEffect(() => {
		const matchWithTitle = [...matches].reverse().find((m) => {
			const h = m.handle as RouteHandle | undefined;
			return Boolean(h?.title);
		});

		const h = matchWithTitle?.handle as RouteHandle | undefined;

		let pageTitle = 'Plataforma';
		if (h?.title && matchWithTitle) {
			// Cast a RouteMatch para cumplir con el tipo
			pageTitle = typeof h.title === 'function' ? h.title(matchWithTitle as unknown as RouteMatch) : h.title;
		}

		document.title = pageTitle;
	}, [matches]);

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
