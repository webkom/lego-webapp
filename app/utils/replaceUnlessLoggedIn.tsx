import { LoginRequiredPage } from 'app/components/LoginForm';
import { useUserContext } from 'app/routes/app/AppRoute';
import type { ComponentType } from 'react';

const replaceUnlessLoggedIn =
  <RP extends object>(
    ReplacementComponent: ComponentType<RP> = LoginRequiredPage
  ) =>
  <P extends object>(Component: ComponentType<P>) => {
    const LoginGuard = (props: P & RP) => {
      const { loggedIn } = useUserContext();
      if (loggedIn) {
        return <Component {...props} />;
      }
      return <ReplacementComponent {...props} />;
    };

    return LoginGuard;
  };

export default replaceUnlessLoggedIn;
export const guardLogin = replaceUnlessLoggedIn(LoginRequiredPage);
