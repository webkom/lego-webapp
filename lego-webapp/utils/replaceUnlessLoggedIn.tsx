import LoginPage from 'app/routes/auth/components/LoginPage';
import { useIsLoggedIn } from '~/redux/slices/auth';
import type { ComponentType } from 'react';

const LoginRequiredPage: ComponentType = () => <LoginPage loginRequired />;

const replaceUnlessLoggedIn =
  <RP extends object>(
    ReplacementComponent: ComponentType<RP> = LoginRequiredPage,
  ) =>
  <P extends object>(Component: ComponentType<P>) => {
    const LoginGuard = (props: P & RP) => {
      const loggedIn = useIsLoggedIn();
      if (loggedIn) {
        return <Component {...props} />;
      }
      return <ReplacementComponent {...props} />;
    };

    return LoginGuard;
  };

export default replaceUnlessLoggedIn;
export const guardLogin = replaceUnlessLoggedIn(LoginRequiredPage);
