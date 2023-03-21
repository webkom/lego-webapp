import { useState } from 'react';
import { Content } from 'app/components/Content';
import { Flex } from 'app/components/Layout';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
} from 'app/components/LoginForm';
import styles from './Login.css';
import type { ReactNode, MouseEvent } from 'react';

const LoginPage = () => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgotPassword'>(
    'login'
  );
  const isLogin = mode === 'login';

  const toggleRegisterUser = (e: MouseEvent) => {
    setMode('register');
    e.stopPropagation();
  };
  const toggleForgotPassword = (e: MouseEvent) => {
    setMode('forgotPassword');
    e.stopPropagation();
  };
  const toggleBack = (e: MouseEvent) => {
    setMode('login');
    e.stopPropagation();
  };

  let title: string;
  let form: ReactNode;

  switch (mode) {
    case 'login': {
      title = 'Logg inn';
      form = <LoginForm />;
      break;
    }
    case 'register': {
      title = 'Register';
      form = <RegisterForm />;
      break;
    }
    case 'forgotPassword': {
      title = 'Glemt passord';
      form = <ForgotPasswordForm />;
      break;
    }
    default:
      break;
  }

  return (
    <Content>
      <Flex justifyContent="space-between" alignItems="center">
        <h2>{title}</h2>
        {isLogin && (
          <div>
            <button
              onClick={toggleForgotPassword}
              className={styles.toggleButton}
            >
              Glemt passord
            </button>
            <span className={styles.toggleButton}>&bull;</span>
            <button
              onClick={toggleRegisterUser}
              className={styles.toggleButton}
            >
              Jeg er ny
            </button>
          </div>
        )}
        {!isLogin && (
          <button onClick={toggleBack} className={styles.toggleButton}>
            Tilbake
          </button>
        )}
      </Flex>
      {form}
    </Content>
  );
};

export default LoginPage;
