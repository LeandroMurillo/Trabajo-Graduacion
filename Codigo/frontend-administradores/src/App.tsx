import * as React from 'react';
import PersonIcon from '@mui/icons-material/Person';
import CasesIcon from '@mui/icons-material/Cases';
import CategoryIcon from '@mui/icons-material/Category';
import BusinessIcon from '@mui/icons-material/Business';
import PaletteIcon from '@mui/icons-material/Palette';
import GroupIcon from '@mui/icons-material/Group';
import PaymentsIcon from '@mui/icons-material/Payments';
import { Outlet, useNavigate, useLocation, Navigate, useParams } from 'react-router';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import type {
	Navigation,
	Authentication,
	Session as TPBaseSession,
} from '@toolpad/core/AppProvider';
import { logout, restaurarSesion, type Session, getStoredEmpresaSlug } from './auth';

import { esARTheme, esARLocaleText } from './i18n/es-AR';

const API_ROOT = import.meta.env.VITE_API_URL as string;

export function getApiBase() {
	if (typeof window === 'undefined') {
		return API_ROOT;
	}

	const pathname = window.location.pathname;

	if (pathname === '/' || pathname.startsWith('/sign-in')) {
		return API_ROOT;
	}

	const segments = pathname.split('/');
	const empresa = segments[1];

	if (!empresa) {
		throw new Error('No se pudo determinar la empresa desde la URL');
	}

	return `${API_ROOT}/${empresa}`;
}

function buildAdminNavigation(empresa: string): Navigation {
	const base = empresa;

	return [
		{ kind: 'header', title: 'Menú' },
		{
			segment: `${base}/vacantes`,
			title: 'vacantes',
			icon: <CasesIcon />,
			pattern: `${base}/vacantes{/:idVacante}*`,
		},
		{
			segment: `${base}/categorias`,
			title: 'categorías',
			icon: <CategoryIcon />,
		},
		{
			segment: `${base}/postulantes`,
			title: 'postulantes',
			icon: <PersonIcon />,
			pattern: `${base}/postulantes{/:postulanteId}*`,
		},
		{
			segment: `${base}/estilos`,
			title: 'estilos',
			icon: <PaletteIcon />,
		},
	];
}

function buildSuperadminNavigation(empresa: string): Navigation {
	const base = empresa;

	return [
		{ kind: 'header', title: 'Menú' },
		{
			segment: `${base}/empresas`,
			title: 'empresas',
			icon: <BusinessIcon />,
		},
		{
			segment: `${base}/administradores`,
			title: 'administradores',
			icon: <GroupIcon />,
		},
		{
			segment: `${base}/cuotas`,
			title: 'cuotas',
			icon: <PaymentsIcon />,
		},
	];
}

const SUPER_ROUTES_RE = /^\/[^/]+\/(empresas|administradores|cuotas)(\/|$)/;

function useAuthState() {
	const [session, setSession] = React.useState<Session | null>(null);
	const [loading, setLoading] = React.useState(true);
	const fetched = React.useRef(false);

	React.useEffect(() => {
		if (fetched.current) return;
		fetched.current = true;
		(async () => {
			setLoading(true);
			const s = await restaurarSesion();
			setSession(s);
			setLoading(false);
		})();
	}, []);

	return { session, setSession, loading };
}

export default function App() {
	const navigate = useNavigate();
	const location = useLocation();
	const params = useParams();
	const { session, setSession, loading } = useAuthState();

	const AUTHENTICATION: Authentication = {
		signIn: async () => navigate('/sign-in'),
		signOut: async () => {
			await logout();
			setSession(null);
			navigate('/sign-in', { replace: true });
		},
	};

	const TP_SESSION: TPBaseSession | null = session
		? {
				user: {
					id: String(session.usuario.id),
					name:
						(session.usuario as { nombre?: string }).nombre ?? session.usuario.email.split('@')[0],
					email: session.usuario.email,
					image: (session.usuario as { imagen?: string }).imagen ?? undefined,
				},
			}
		: null;

	const isAuthRoute = location.pathname.startsWith('/sign-in');
	const isSuperadminUser = session?.usuario.rol === 'SUPERADMIN';

	let empresa = params.empresa ?? '';
	if (!empresa) {
		const segments = location.pathname.split('/').filter(Boolean);
		if (segments[0] && segments[0] !== 'sign-in') {
			empresa = segments[0];
		}
	}

	React.useEffect(() => {
		if (!session) return;

		const storedEmpresa = getStoredEmpresaSlug();
		if (!empresa || !storedEmpresa) return;

		if (empresa !== storedEmpresa) {
			logout();
			setSession(null);
			navigate('/sign-in', { replace: true });
		}
	}, [session, empresa, location.pathname, location.search, navigate, setSession]);

	if (loading) return null;

	if (!session && !isAuthRoute) {
		return <Navigate to='/sign-in' replace />;
	}

	if (!isSuperadminUser && SUPER_ROUTES_RE.test(location.pathname)) {
		return <Navigate to='/' replace />;
	}

	let navigation: Navigation = [];
	if (empresa) {
		navigation = isSuperadminUser
			? buildSuperadminNavigation(empresa)
			: buildAdminNavigation(empresa);
	}

	const branding = isSuperadminUser
		? { title: 'Panel Superadmin', homeUrl: `/${empresa}/empresas` }
		: { title: `Bienvenido Admin ${empresa.toUpperCase()}`, homeUrl: `/${empresa}/vacantes` };

	return (
		<ReactRouterAppProvider
			navigation={navigation}
			branding={branding}
			theme={esARTheme}
			localeText={esARLocaleText}
			authentication={AUTHENTICATION}
			session={TP_SESSION ?? undefined}
		>
			<Outlet context={{ session, setSession }} />
		</ReactRouterAppProvider>
	);
}
