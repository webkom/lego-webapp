import React, { Component } from 'react';
import styles from './Login.css';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm
} from 'app/components/LoginForm';
import { Flex } from 'app/components/Layout';
import { Content } from 'app/components/Content';

interface State {
  mode: 'login' | 'register' | 'forgotPassword';
}

class LoginPage extends Component<{}, State> {
  state = {
    mode: 'login'
  };

  toggleRegisterUser = (e: Event) => {
    this.setState({ mode: 'register' });
    e.stopPropagation();
  };

  toggleForgotPassword = (e: Event) => {
    this.setState({ mode: 'forgotPassword' });
    e.stopPropagation();
  };

  toggleBack = (e: Event) => {
    this.setState({ mode: 'login' });
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
    }
    return (
      <Content>
        <Flex
          component="h2"
          justifyContent="space-between"
          allignItems="center"
          style={{ whitespace: 'nowrap' }}
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
