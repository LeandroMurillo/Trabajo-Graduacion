// src/auth.ts
const API = import.meta.env.VITE_API_URL;
const TOKEN_KEY = 'authToken';
const EMPRESA_KEY = 'empresaSlug';

export interface Usuario {
	id: number | string;
	email: string;
	rol: 'ADMIN' | 'SUPERADMIN';
	idEmpresa: number | null;
}

export interface Session {
	usuario: Usuario;
	token: string;
	empresaSlug: string;
}

export function getStoredEmpresaSlug(): string | null {
	if (typeof window === 'undefined') return null;
	return localStorage.getItem(EMPRESA_KEY);
}

async function safeJson(res: Response) {
	try {
		return await res.json();
	} catch {
		return {};
	}
}

export async function login(email: string, password: string) {
	const res = await fetch(`${API}/auth/login`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		const { message } = await safeJson(res);
		return { error: message ?? 'Credenciales inválidas' } as const;
	}

	const { token, usuario, empresaSlug } = await res.json();

	localStorage.setItem(TOKEN_KEY, token);
	localStorage.setItem(EMPRESA_KEY, empresaSlug);

	return {
		session: { token, usuario, empresaSlug } as Session,
	} as const;
}

export function getToken(): string | null {
	return localStorage.getItem(TOKEN_KEY);
}

export function logout() {
	localStorage.removeItem(TOKEN_KEY);
	localStorage.removeItem(EMPRESA_KEY);
}

export async function restaurarSesion(): Promise<Session | null> {
	const token = getToken();
	if (!token) return null;

	const empresaSlug = getStoredEmpresaSlug();
	if (!empresaSlug) {
		logout();
		return null;
	}

	const res = await fetch(`${API}/auth/me`, {
		headers: { Authorization: `Bearer ${token}` },
	});

	if (!res.ok) {
		logout();
		return null;
	}

	const { usuario } = await res.json();
	return { token, usuario, empresaSlug };
}

export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
	const token = getToken();
	const headers = new Headers(init.headers || {});
	if (token) headers.set('Authorization', `Bearer ${token}`);
	const res = await fetch(input, { ...init, headers });
	if (res.status === 401) logout();
	return res;
}
