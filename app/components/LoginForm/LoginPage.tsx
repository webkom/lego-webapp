import { Component } from 'react';
import { Content } from 'app/components/Content';
import { Flex } from 'app/components/Layout';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
} from 'app/components/LoginForm';
import styles from './Login.css';

type State = {
  mode: 'login' | 'register' | 'forgotPassword';
};
type Props = Record<string, any>;

class LoginPage extends Component<Props, State> {
  state = {
    mode: 'login',
  };
  toggleRegisterUser = (e: Event) => {
    this.setState({
      mode: 'register',
    });
    e.stopPropagation();
  };
  toggleForgotPassword = (e: Event) => {
    this.setState({
      mode: 'forgotPassword',
    });
    e.stopPropagation();
  };
  toggleBack = (e: Event) => {
    this.setState({
      mode: 'login',
    });
    e.stopPropagation();
  };

  render() {
    const isLogin = this.state.mode === 'login';
    let title, form;

    switch (this.state.mode) {
      case 'login':
        title = 'Logg inn';
        form = <LoginForm />;
        break;

      case 'register':
        title = 'Register';
        form = <RegisterForm />;
        break;

      case 'forgotPassword':
        title = 'Glemt passord';
        form = <ForgotPasswordForm />;
        break;

      default:
        break;
    }

    return (
      <Content>
        <Flex
          component="h2"
          justifyContent="space-between"
          allignItems="center"
          style={{
            whitespace: 'nowrap',
          }}
        >
          {title}
          {isLogin && (
            <div>
              <button
                onClick={this.toggleForgotPassword}
                className={styles.toggleButton}
              >
                Glemt passord
              </button>
              <span className={styles.toggleButton}>&bull;</span>
              <button
                onClick={this.toggleRegisterUser}
                className={styles.toggleButton}
              >
                Jeg er ny
              </button>
            </div>
          )}
          {!isLogin && (
            <button onClick={this.toggleBack} className={styles.toggleButton}>
              Tilbake
            </button>
          )}
        </Flex>
        {form}
      </Content>
    );
  }
}

export default LoginPage;
