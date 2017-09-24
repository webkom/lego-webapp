import React from 'react';
import styles from './Login.css';
import { Container } from '../Layout';
import LoginForm from './LoginForm';

const LoginPage = props => (
  <Container>
    <div className={styles.root}>
      <h2>Logg inn</h2>
      <LoginForm />
    </div>
  </Container>
);

export default LoginPage;
