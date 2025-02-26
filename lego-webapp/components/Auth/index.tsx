import {
  Button,
  ButtonGroup,
  Card,
  Flex,
  Icon,
  Page,
} from '@webkom/lego-bricks';
import { ArrowLeft } from 'lucide-react';
import { useState } from 'react';
import {
  ForgotPasswordForm,
  LoginForm,
  RegisterForm,
} from '~/components/LoginForm';
import { ContentMain } from '../Content';
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
      <Flex
        wrap
        gap="var(--spacing-sm)"
        justifyContent="space-between"
        alignItems="center"
      >
        <h2>{title}</h2>
        {authMode === AuthMode.LOGIN ? (
          <ButtonGroup>
            <Button
              size="small"
              onPress={() => setAuthMode(AuthMode.FORGOT_PASSWORD)}
            >
              Glemt passord
            </Button>
            <Button size="small" onPress={() => setAuthMode(AuthMode.REGISTER)}>
              Jeg er ny
            </Button>
          </ButtonGroup>
        ) : (
          <Button size="small" onPress={() => setAuthMode(AuthMode.LOGIN)}>
            <Icon iconNode={<ArrowLeft />} size={18} />
            Tilbake
          </Button>
        )}
      </Flex>
      <Form />
    </Flex>
  );
};

export default Auth;
