import { Button, Card, Flex, Icon, Page } from '@webkom/lego-bricks';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from '~/components/LoginForm';
import { ContentMain } from '../Content';
import styles from './Auth.module.css';
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

const subtitles: { [M in AuthMode]?: string } = {
  [AuthMode.REGISTER]: 'Vi sender deg en e-post for å fullføre registreringen.',
  [AuthMode.FORGOT_PASSWORD]:
    'Skriv inn e-posten din, så sender vi deg en lenke for å tilbakestille det.',
};

const forms: { [M in AuthMode]: ComponentType } = {
  [AuthMode.LOGIN]: LoginForm,
  [AuthMode.REGISTER]: RegisterForm,
  [AuthMode.FORGOT_PASSWORD]: ForgotPasswordForm,
};

type Props = {
  asPage?: boolean;
  loginRequired?: boolean;
};

const Auth = ({ asPage = false, loginRequired = false }: Props) => {
  const [authMode, setAuthMode] = useState<AuthMode>(AuthMode.LOGIN);

  const title = titles[authMode];
  const Form = forms[authMode];

  if (asPage) {
    return (
      <Page
        title={title}
        actionButtons={
          <>
            {authMode === AuthMode.LOGIN ? (
              <>
                <Button onPress={() => setAuthMode(AuthMode.FORGOT_PASSWORD)}>
                  Glemt passord
                </Button>
                <Button onPress={() => setAuthMode(AuthMode.REGISTER)}>
                  Jeg er ny
                </Button>
              </>
            ) : (
              <Button onPress={() => setAuthMode(AuthMode.LOGIN)}>
                <Icon iconNode={<ArrowLeft />} size={19} />
                Tilbake
              </Button>
            )}
          </>
        }
      >
        <ContentMain>
          {loginRequired && (
            <Card severity="danger">Denne siden krever innlogging</Card>
          )}
          <Form />
        </ContentMain>
      </Page>
    );
  }

  return (
    <Flex column gap="var(--spacing-sm)">
      {authMode !== AuthMode.LOGIN && (
        <button
          type="button"
          className={styles.backLink}
          onClick={() => setAuthMode(AuthMode.LOGIN)}
        >
          <Icon iconNode={<ArrowLeft />} size={14} />
          Tilbake til innlogging
        </button>
      )}
      <Flex column gap="var(--spacing-xs)">
        <h2>{title}</h2>
        {subtitles[authMode] && (
          <span className={styles.subtitle}>{subtitles[authMode]}</span>
        )}
      </Flex>
      {authMode === AuthMode.LOGIN ? (
        <LoginForm
          afterFields={
            <button
              type="button"
              className={styles.forgotPassword}
              onClick={() => setAuthMode(AuthMode.FORGOT_PASSWORD)}
            >
              Glemt passord?
            </button>
          }
          secondaryAction={
            <Button onPress={() => setAuthMode(AuthMode.REGISTER)}>
              Jeg er ny
            </Button>
          }
        />
      ) : (
        <Form />
      )}
    </Flex>
  );
};

export default Auth;
