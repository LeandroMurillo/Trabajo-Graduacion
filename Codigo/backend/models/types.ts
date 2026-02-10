export type SortDir = 'asc' | 'desc';
export type EstadoCategoria = 'A' | 'I';
export type EstadoVacante = 'B' | 'P' | 'C';

export interface ResultadoMensajeRow {
	mensaje: string;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };
export type EstiloEmpresa = JsonValue | null;
