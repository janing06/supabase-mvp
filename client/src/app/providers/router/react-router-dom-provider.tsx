import { routes } from '@app/routes';
import { useRoutes } from 'react-router-dom';

export const AppRoute = () => {
	const element = useRoutes(routes);
	return <>{element}</>;
};
