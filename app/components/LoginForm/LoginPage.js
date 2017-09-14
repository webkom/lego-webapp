import React from 'react';
import styles from './Login.css';
import { Content } from '../Layout';
import LoginForm from './LoginForm';

const LoginPage = props => (
  <Content>
    <div className={styles.root}>
      <h2>Logg inn</h2>
      <LoginForm />
    </div>
  </Content>
);

export default LoginPage;
