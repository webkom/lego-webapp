import { useState } from 'react';
import { Flex } from 'app/components/Layout';
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from 'app/components/LoginForm';
import styles from './AuthSection.module.css';
import type { ReactNode, MouseEvent } from 'react';

enum AuthMode {
  LOGIN,
  REGISTER,
  FORGOT_PASSWORD,
}

const titles: { [M in AuthMode]: string } = {
  [AuthMode.LOGIN]: 'Logg inn',
  [AuthMode.REGISTER]: 'Registrer bruker',
  [AuthMode.FORGOT_PASSWORD]: 'Glemt passord',
};

const forms: { [M in AuthMode]: ReactNode } = {
  [AuthMode.LOGIN]: <LoginForm />,
  [AuthMode.REGISTER]: <RegisterForm />,
  [AuthMode.FORGOT_PASSWORD]: <ForgotPasswordForm />,
};

const AuthSection = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);

  const title = titles[authMode];
  const form = forms[authMode];

  const createModeSelector = (mode: AuthMode) => (e: MouseEvent) => {
    setAuthMode(mode);
    e.stopPropagation();
  };

  return (
    <>
      <Flex
        component="h2"
        justifyContent="space-between"
        alignItems="center"
        className="u-mb"
        style={{
          whiteSpace: 'nowrap',
        }}
      >
        {title}
        {authMode === AuthMode.LOGIN ? (
          <div>
            <button
              onClick={createModeSelector(AuthMode.FORGOT_PASSWORD)}
              className={styles.toggleButton}
            >
              Glemt passord
            </button>
            <span className={styles.toggleButton}>&bull;</span>
            <button
              onClick={createModeSelector(AuthMode.REGISTER)}
              className={styles.toggleButton}
            >
              Jeg er ny
            </button>
          </div>
        ) : (
          <button
            onClick={createModeSelector(AuthMode.LOGIN)}
            className={styles.toggleButton}
          >
            Tilbake
          </button>
        )}
      </Flex>
      {form}
    </>
  );
};

export default AuthSection;
