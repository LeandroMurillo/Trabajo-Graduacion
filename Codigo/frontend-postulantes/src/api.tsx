// src/api/api.ts
import CryptoJS from 'crypto-js';
import SHA256 from 'crypto-js/sha256';

import type { Session } from './SessionContext';

import type {
	AltaPostulanteData,
	Categoria,
	Curriculum,
	CurriculumHeadResult,
	FiltroVacantes,
	EstiloData,
	Postulacion,
	Postulante,
	RegisterResponse,
	RestablecerClaveResponse,
	Vacante,
} from './types';

/* ============================================================
   Helpers / config
   ============================================================ */

const API_ORIGIN = import.meta.env.VITE_API_URL;

function getEmpresaSlug(): string {
	const path = window.location.pathname.replace(/^\/+/, '');
	const [slug] = path.split('/');
	return slug || 'acme';
}

function apiUrl(path: string): string {
	if (!path.startsWith('/')) path = `/${path}`;
	const slug = getEmpresaSlug();
	return `${API_ORIGIN}/${slug}${path}`;
}

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
	let msg = fallback;
	try {
		const body = await res.json();
		if (body?.error) msg = body.error;
		if (body?.message) msg = body.message;
	} catch {
		/* ignore */
	}
	return msg;
}

export async function sha256File(file: File): Promise<string> {
	const buffer = await file.arrayBuffer();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(buffer) as any);
	return SHA256(wordArray).toString();
}

/* ============================================================
   API calls
   ============================================================ */

export async function actualizarPostulante(data: Partial<Postulante>): Promise<void> {
	// La ruta en el backend (backend/routes/protected.js) es PATCH /postulantes
	const res = await fetch(apiUrl('/api/postulantes'), {
		method: 'PATCH',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al actualizar el perfil'));
	}
}

export async function fetchEstilo(): Promise<EstiloData> {
	const res = await fetch(apiUrl('/api/estilo'));
	if (!res.ok) throw new Error(await parseErrorMessage(res, 'Error al obtener estilo'));
	return res.json();
}

export async function fetchNombreEmpresa(): Promise<string> {
	const res = await fetch(apiUrl('/api/nombreEmpresa'));
	if (!res.ok)
		throw new Error(await parseErrorMessage(res, 'Error al obtener nombre de la empresa'));
	return res.json();
}

export async function dameVacantes(filtro: FiltroVacantes): Promise<{
	items: Vacante[];
	itemCount: number;
}> {
	const { titulo, categoria, offset, limit } = filtro;

	const qs = new URLSearchParams();

	if (titulo && titulo.trim() !== '') {
		qs.set('titulo', titulo.trim());
	}

	if (categoria && categoria !== 'Todas las categorías') {
		qs.set('categoria', categoria.trim());
	}

	if (Number.isFinite(offset as number) && (offset as number) >= 0) {
		qs.set('offset', String(offset));
	}
	if (Number.isFinite(limit as number) && (limit as number) > 0) {
		qs.set('limit', String(limit));
	}

	const url = qs.toString() ? `/api/vacantes?${qs.toString()}` : '/api/vacantes';
	const res = await fetch(apiUrl(url));

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al obtener vacantes'));
	}

	const data = (await res.json()) as {
		items: Vacante[];
		itemCount: number;
	};

	return {
		items: Array.isArray(data?.items) ? data.items : [],
		itemCount: Number(data?.itemCount ?? 0),
	};
}

export async function dameVacante(id: number): Promise<Vacante> {
	const res = await fetch(apiUrl(`/api/vacantes/${id}`));

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al obtener la vacante'));
	}

	return res.json();
}

export async function dameCategorias(): Promise<Categoria[]> {
	const res = await fetch(apiUrl('/api/categorias'));

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al obtener categorías'));
	}

	return res.json();
}

export async function altaPostulante(data: AltaPostulanteData): Promise<RegisterResponse> {
	const res = await fetch(apiUrl('/api/registro'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify(data),
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al registrar usuario'));
	}

	return res.json();
}

export async function damePostulante(): Promise<Postulante> {
	const res = await fetch(apiUrl('/api/perfil'), { credentials: 'include' });

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al obtener el perfil del postulante'));
	}

	return res.json();
}

export async function loginPostulante(email: string, password: string): Promise<void> {
	const res = await fetch(apiUrl('/api/login'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify({ email, password }),
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al iniciar sesión'));
	}
}

export async function logoutPostulante(): Promise<void> {
	const res = await fetch(apiUrl('/api/logout'), {
		method: 'POST',
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al cerrar sesión'));
	}
}

export async function fetchSession(): Promise<Session | null> {
	const res = await fetch(apiUrl('/api/session'), { credentials: 'include' });
	if (!res.ok) return null;

	const data = await res.json();
	return data?.user ? { user: data.user } : null;
}

export async function dameCurriculum(): Promise<Curriculum[]> {
	const res = await fetch(apiUrl('/api/curriculums'), {
		method: 'GET',
		credentials: 'include',
	});

	if (!res.ok) {
		// Mantengo tu patrón de error con status para que lo uses (401/403, etc.)
		const error = new Error('No autorizado o sesión expirada') as Error & { status?: number };
		error.status = res.status;
		throw error;
	}

	return res.json();
}

export async function headCurriculum(): Promise<CurriculumHeadResult> {
	const url = apiUrl('/api/curriculums');

	const res = await fetch(url, {
		method: 'HEAD',
		credentials: 'include',
	});

	const cd = res.headers.get('Content-Disposition') || '';
	const m = cd.match(/filename\*?=(?:UTF-8'')?"?([^";]+)"?/i);
	const filename = m?.[1] ? decodeURIComponent(m[1]) : undefined;

	return { status: res.status, filename, url };
}

export async function altaCurriculum(file: File, hash: string): Promise<unknown> {
	const formData = new FormData();
	formData.append('curriculum', file);
	formData.append('hash', hash);

	const res = await fetch(apiUrl('/api/curriculums'), {
		method: 'POST',
		body: formData,
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al subir currículum'));
	}

	return res.json();
}

export async function damePostulaciones(): Promise<Postulacion[]> {
	const res = await fetch(apiUrl('/api/postulaciones'), {
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al obtener postulaciones'));
	}

	return res.json();
}

export async function darDeBajaPostulacion(id: number): Promise<void> {
	const res = await fetch(apiUrl(`/api/postulaciones/${id}`), {
		method: 'DELETE',
		credentials: 'include', // si usás cookies/sesión
		headers: { 'Content-Type': 'application/json' },
	});

	if (!res.ok) {
		const body = await res.json().catch(() => ({}));
		throw new Error(body?.error || 'NO_SE_PUDO_DAR_DE_BAJA');
	}
}

export async function enviarRestablecerClave(email: string): Promise<RestablecerClaveResponse> {
	const res = await fetch(apiUrl('/api/restablecer-clave'), {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ email }),
	});

	if (!res.ok) {
		throw new Error(await parseErrorMessage(res, 'Error al enviar el correo'));
	}

	return res.json();
}
