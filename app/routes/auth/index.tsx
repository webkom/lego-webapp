import { type RouteObject } from 'react-router-dom';
import { lazyComponent } from 'app/utils/lazyComponent';

const LoginPage = lazyComponent(() => import('./components/LoginPage'));

const authRoute: RouteObject[] = [{ index: true, lazy: LoginPage }];

export default authRoute;
