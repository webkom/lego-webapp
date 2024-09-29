import { Button, Flex } from '@webkom/lego-bricks';
import { useState } from 'react';
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from 'app/components/LoginForm';
import styles from './AuthSection.css';
import type { ComponentType } from 'react';

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

const forms: { [M in AuthMode]: ComponentType } = {
  [AuthMode.LOGIN]: LoginForm,
  [AuthMode.REGISTER]: RegisterForm,
  [AuthMode.FORGOT_PASSWORD]: ForgotPasswordForm,
};

const AuthSection = () => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);

  const title = titles[authMode];
  const Form = forms[authMode];

  const createModeSelector = (mode: AuthMode) => () => {
    setAuthMode(mode);
  };

  return (
    <>
      <Flex
        wrap
        gap="var(--spacing-sm)"
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
          <Flex gap="var(--spacing-sm)">
            <Button
              flat
              onPress={createModeSelector(AuthMode.FORGOT_PASSWORD)}
              className={styles.toggleButton}
            >
              Glemt passord
            </Button>
            <span className={styles.dot}>&bull;</span>
            <Button
              flat
              onPress={createModeSelector(AuthMode.REGISTER)}
              className={styles.toggleButton}
            >
              Jeg er ny
            </Button>
          </Flex>
        ) : (
          <Button
            flat
            onPress={createModeSelector(AuthMode.LOGIN)}
            className={styles.toggleButton}
          >
            Tilbake
          </Button>
        )}
      </Flex>
      <Form />
    </>
  );
};

export default AuthSection;
