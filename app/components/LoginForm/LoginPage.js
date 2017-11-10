// @flow

import React, { Component } from 'react';
import { Container } from '../Layout';
import { LoginForm, RegisterForm, ForgotPasswordForm } from '../LoginForm';
import styles from './Login.css';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { Link } from 'react-router';

type State = {
  mode: 'login' | 'register' | 'forgotPassword'
};

class LoginPage extends Component<null, State> {
  state: State = {
    mode: 'login'
  };

  toggleRegisterUser = (e: Event) => {
    this.setState({ mode: 'register' });
  };

  toggleForgotPassword = (e: Event) => {
    this.setState({ mode: 'forgotPassword' });
  };

  toggleBack = (e: Event) => {
    this.setState({ mode: 'login' });
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
        title = 'Registrer bruker';
        form = <RegisterForm />;
        break;
      case 'forgotPassword':
        title = 'Glemt passord';
        form = <ForgotPasswordForm />;
        break;
    }
    return (
      <Container className={styles.window}>
        {isLogin ? (
          <NavigationTab title={title} className={styles.detailTitle}>
            <NavigationLink to="">
              <Link onClick={this.toggleForgotPassword}>Glemt passord</Link>
            </NavigationLink>
            <NavigationLink to="">
              <Link onClick={this.toggleRegisterUser}>Jeg er ny</Link>
            </NavigationLink>
          </NavigationTab>
        ) : (
          <NavigationTab title={title} className={styles.detailTitle}>
            <NavigationLink to="">
              <Link onClick={this.toggleBack}>Tilbake</Link>
            </NavigationLink>
          </NavigationTab>
        )}
        {form}
      </Container>
    );
  }
}
export default LoginPage;
