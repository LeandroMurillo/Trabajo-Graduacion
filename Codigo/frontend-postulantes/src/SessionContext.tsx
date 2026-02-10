// src/SessionContext.tsx
import * as React from 'react';
import { fetchSession } from './api';

export interface Session {
	user: {
		name?: string;
		email?: string;
		image?: string;
	};
}

interface SessionContextType {
	session: Session | null;
	setSession: (session: Session | null) => void;
	loading: boolean;
}

const SessionContext = React.createContext<SessionContextType>({
	session: null,
	setSession: () => {},
	loading: true,
});

export default SessionContext;

export const useSession = () => React.useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = React.useState<Session | null>(null);
	const [loading, setLoading] = React.useState(true);

	React.useEffect(() => {
		async function restoreSession() {
			try {
				const restored = await fetchSession();
				setSession(restored);
			} finally {
				setLoading(false);
			}
		}

		restoreSession();
	}, []);

	const value = React.useMemo(() => ({ session, setSession, loading }), [session, loading]);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
