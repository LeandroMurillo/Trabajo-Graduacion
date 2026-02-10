// src/routes/SignIn.tsx
import { SignInPage } from '@toolpad/core/SignInPage';
import { Navigate, useNavigate, useOutletContext } from 'react-router';
import type { Session } from '../auth';
import { login } from '../auth';

type Ctx = { session: Session | null; setSession: (s: Session) => void };

export default function SignIn() {
	const { setSession, session } = useOutletContext<Ctx>();
	const navigate = useNavigate();

	function resolveDestination(sess: Session) {
		const { usuario, empresaSlug } = sess;

		if (usuario.rol === 'SUPERADMIN') {
			return `/${empresaSlug}/empresas`;
		}

		return `/${empresaSlug}/vacantes`;
	}

	if (session) {
		const dest = resolveDestination(session);
		return <Navigate to={dest} replace />;
	}

	return (
		<SignInPage
			providers={[{ id: 'credentials', name: 'Email y contraseña' }]}
			signIn={async (provider, formData) => {
				if (provider.id !== 'credentials') return { error: 'Proveedor no válido' };

				const email = String(formData.get('email') ?? '').trim();
				const password = String(formData.get('password') ?? '');

				if (!email || !password) {
					return { error: 'Email y contraseña son obligatorios' };
				}

				const result = await login(email, password);
				if ('error' in result) return { error: result.error };

				const sess = result.session;
				setSession(sess);

				const dest = resolveDestination(sess);
				navigate(dest, { replace: true });

				return {};
			}}
			slotProps={{ submitButton: { children: 'Iniciar sesión' } }}
		/>
	);
}
