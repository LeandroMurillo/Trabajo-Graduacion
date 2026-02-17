import { z } from 'zod';

const sortDir = z.enum(['asc', 'desc']);

const sortItem = z
	.object({
		field: z.string().min(1),
		sort: sortDir,
	})
	.strict();

const filterItem = z
	.object({
		field: z.string().min(1),
		operator: z.string().optional(),
		value: z.unknown().optional(),
	})
	.passthrough();

export const FiltroSchema = z
	.object({
		page: z
			.preprocess((v) => {
				const n = Number.parseInt(String(v ?? '0'), 10);
				return Number.isFinite(n) ? n : NaN;
			}, z.number().int().min(0))
			.default(0),

		pageSize: z
			.preprocess((v) => {
				const n = Number.parseInt(String(v ?? '25'), 10);
				return Number.isFinite(n) ? n : NaN;
			}, z.number().int().min(1).max(200))
			.default(25),

		sort: z
			.preprocess((v) => {
				if (v === undefined || v === null) return '[]';
				const s = String(v).trim();
				return s === '' ? '[]' : s;
			}, z.string())
			.default('[]'),

		filter: z
			.preprocess((v) => {
				if (v === undefined || v === null) return '[]';
				const s = String(v).trim();
				return s === '' ? '[]' : s;
			}, z.string())
			.default('[]'),
	})
	.strict()
	.superRefine((q, ctx) => {
		// ===== sort =====
		let sortParsed: unknown;
		try {
			sortParsed = JSON.parse(q.sort);
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['sort'],
				message: 'sort inválido (JSON).',
			});
			sortParsed = null;
		}

		if (!Array.isArray(sortParsed)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['sort'],
				message: 'sort debe ser un array JSON.',
			});
		} else {
			for (let i = 0; i < sortParsed.length; i++) {
				const r = sortItem.safeParse(sortParsed[i]);
				if (!r.success) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['sort'],
						message: `sort[${i}] inválido (se espera { field, sort }).`,
					});
					break;
				}
			}
		}

		// ===== filter =====
		let filterParsed: unknown;
		try {
			filterParsed = JSON.parse(q.filter);
		} catch {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['filter'],
				message: 'filter inválido (JSON).',
			});
			filterParsed = null;
		}

		if (!Array.isArray(filterParsed)) {
			ctx.addIssue({
				code: z.ZodIssueCode.custom,
				path: ['filter'],
				message: 'filter debe ser un array JSON.',
			});
		} else {
			for (let i = 0; i < filterParsed.length; i++) {
				const r = filterItem.safeParse(filterParsed[i]);
				if (!r.success) {
					ctx.addIssue({
						code: z.ZodIssueCode.custom,
						path: ['filter'],
						message: `filter[${i}] inválido (se espera { field, value? }).`,
					});
					break;
				}
			}
		}
	});

export type Filtro = z.infer<typeof FiltroSchema>;
