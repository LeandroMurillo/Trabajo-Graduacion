import { getToken, logout } from '../auth';

export async function fetchJson(input: RequestInfo, init: RequestInit = {}) {
	const token = getToken();

	// construimos headers combinando los existentes + defaults
	const headers = new Headers(init.headers || {});
	if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
	if (token) headers.set('Authorization', `Bearer ${token}`);

	// ejecutamos el fetch
	const res = await fetch(input, { ...init, headers });

	// intentamos parsear el cuerpo como JSON
	const data = await res.json().catch(() => ({}));

	// si el token expira o la sesión no es válida, deslogueamos
	if (res.status === 401) {
		logout();
		throw new Error('Sesión expirada o no autorizada');
	}

	// si hay otro error HTTP, lanzamos con mensaje legible
	if (!res.ok) {
		const msg = data?.message || data?.error || `Error HTTP ${res.status}: ${res.statusText}`;
		throw new Error(msg);
	}

	return data;
}

export async function fetchBlob(input: RequestInfo, init: RequestInit = {}) {
	const token = getToken();

	const headers = new Headers(init.headers || {});
	if (token) headers.set('Authorization', `Bearer ${token}`);

	const res = await fetch(input, { ...init, headers });

	if (res.status === 401) {
		logout();
		throw new Error('Sesión expirada o no autorizada');
	}

	if (!res.ok) {
		const text = await res.text().catch(() => '');
		throw new Error(text || `Error HTTP ${res.status}: ${res.statusText}`);
	}

	return await res.blob();
}

export function fromSlug(slug?: string, mode: 'lower' | 'title' = 'lower'): string {
	if (!slug) return '';
	const raw = decodeURIComponent(slug).replace(/-/g, ' ').trim();
	if (mode === 'title') {
		return raw.replace(/\b\p{L}/gu, (c) => c.toUpperCase());
	}
	return raw.toLowerCase();
}

export function toDate(value: unknown): Date | null {
	if (value == null) return null;

	if (value instanceof Date) {
		return Number.isNaN(value.getTime()) ? null : value;
	}

	if (typeof value === 'number') {
		const ms = value < 1e12 ? value * 1000 : value;
		const d = new Date(ms);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	if (typeof value === 'string') {
		const s = value.trim();
		if (!s) return null;

		const onlyDate = /^\d{4}-\d{2}-\d{2}$/.test(s);
		if (onlyDate) {
			const d = new Date(`${s}T00:00:00`);
			return Number.isNaN(d.getTime()) ? null : d;
		}

		const dateTimeWithSpace = /^\d{4}-\d{2}-\d{2} \d/.test(s) ? s.replace(' ', 'T') : s;

		const d = new Date(dateTimeWithSpace);
		return Number.isNaN(d.getTime()) ? null : d;
	}

	return null;
}

export function slugify(texto: string, maxLen = 80): string {
	const base = (texto ?? '')
		.toString()
		.trim()
		.toLowerCase()
		.normalize('NFD')
		.replace(/[\u0300-\u036f]/g, '')
		.replace(/ñ/g, 'n')
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');

	return base
		.slice(0, maxLen)
		.replace(/(^-|-$)/g, '')
		.replace(/--+/g, '-');
}

export function habilidadesCsvToArray(input: unknown): string[] {
	if (input == null) return [];

	if (Array.isArray(input)) {
		return input
			.map(String)
			.map((s) => s.trim())
			.filter(Boolean);
	}

	const raw = String(input).trim();
	if (!raw) return [];

	return raw
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

export function habilidadesCsvToJson(input: unknown): string {
	return JSON.stringify(habilidadesCsvToArray(input));
}
