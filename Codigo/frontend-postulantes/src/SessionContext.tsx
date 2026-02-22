// src/SessionContext.tsx
import * as React from 'react';
import { fetchSession } from './api';

export interface Session {
	user: {
		uid: string;
		name: string | null;
		email: string | null;
		image: string | null;
	};
}

interface SessionContextType {
	session: Session | null;
	setSession: (session: Session | null) => void;
	refreshSession: () => Promise<Session | null>;
	loading: boolean;
}

const SessionContext = React.createContext<SessionContextType>({
	session: null,
	setSession: () => {},
	refreshSession: async () => null,
	loading: true,
});

export default SessionContext;
export const useSession = () => React.useContext(SessionContext);

export function SessionProvider({ children }: { children: React.ReactNode }) {
	const [session, setSession] = React.useState<Session | null>(null);
	const [loading, setLoading] = React.useState(true);

	const refreshSession = React.useCallback(async () => {
		const restored = await fetchSession();
		setSession(restored);
		return restored;
	}, []);

	React.useEffect(() => {
		async function restoreSession() {
			try {
				await refreshSession();
			} finally {
				setLoading(false);
			}
		}
		restoreSession();
	}, [refreshSession]);

	const value = React.useMemo(
		() => ({ session, setSession, refreshSession, loading }),
		[session, refreshSession, loading],
	);

	return <SessionContext.Provider value={value}>{children}</SessionContext.Provider>;
}
