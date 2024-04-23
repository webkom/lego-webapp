import { LoginRequiredPage } from 'app/components/LoginForm';
import { useIsLoggedIn } from 'app/reducers/auth';
import type { ComponentType } from 'react';

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
