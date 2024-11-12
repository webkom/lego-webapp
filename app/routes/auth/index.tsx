import loadable from '@loadable/component';
import { type RouteObject } from 'react-router-dom';

const LoginPage = loadable(() => import('./components/LoginPage'));

const authRoute: RouteObject[] = [{ index: true, Component: LoginPage }];

export default authRoute;
