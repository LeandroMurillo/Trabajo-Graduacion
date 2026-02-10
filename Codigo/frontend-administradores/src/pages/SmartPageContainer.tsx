import * as React from 'react';
import { PageContainer } from '@toolpad/core/PageContainer';
import type { PageContainerProps } from '@toolpad/core/PageContainer';
import { useLocation, matchPath } from 'react-router';

type Params = Record<string, string>;

type Crumb = {
	title: string | ((params: Params) => string);
	path?: string | ((params: Params) => string);
};

export type RouteSpec = {
	path: string;
	title: string | ((params: Params) => string);
	breadcrumbs?: Crumb[] | false;
};

function resolveCrumb(c: Crumb, params: Params) {
	const title = typeof c.title === 'function' ? c.title(params) : c.title;
	const path = typeof c.path === 'function' ? c.path(params) : c.path;
	return { title, path };
}

export type SmartPageContainerProps = PageContainerProps & {
	routeSpecs: RouteSpec[];
	baseParamName?: string;
	fallback?: {
		title?: string | ((params: Params) => string);
		breadcrumbs?: Crumb[] | false;
	};
};

export default function SmartPageContainer({
	routeSpecs,
	fallback,
	baseParamName = 'empresa',
	children,
	...props
}: SmartPageContainerProps) {
	const { pathname } = useLocation();

	const match = React.useMemo(() => {
		for (const spec of routeSpecs) {
			const tenant = matchPath({ path: `/:${baseParamName}${spec.path}`, end: true }, pathname);

			if (tenant) {
				return { spec, params: (tenant.params as Params) || {} };
			}
		}

		return null;
	}, [pathname, routeSpecs, baseParamName]);

	if (!match) {
		const fbTitle = typeof fallback?.title === 'function' ? fallback.title({}) : fallback?.title;

		const fbCrumbs = fallback?.breadcrumbs === false ? false : (fallback?.breadcrumbs ?? []);
		const crumbs = fbCrumbs === false ? undefined : fbCrumbs.map((c) => resolveCrumb(c, {}));

		return (
			<PageContainer {...props} title={fbTitle} breadcrumbs={crumbs}>
				{fbTitle ? <title>{fbTitle}</title> : null}
				{children}
			</PageContainer>
		);
	}

	const { spec, params } = match;

	const title = typeof spec.title === 'function' ? spec.title(params) : spec.title;

	const crumbs =
		spec.breadcrumbs === false ? undefined : spec.breadcrumbs?.map((c) => resolveCrumb(c, params));

	return (
		<PageContainer {...props} title={title} breadcrumbs={crumbs}>
			{title ? <title>{title}</title> : null}
			{children}
		</PageContainer>
	);
}
