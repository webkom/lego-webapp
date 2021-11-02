// @flow

import styles from '../Header.css';
import {
  LoginForm,
  RegisterForm,
  ForgotPasswordForm,
} from 'app/components/LoginForm';

type Props = {};

type State = {
  mode: string,
};

const LoginDropdown = (props: Props, state: State) => {
  const isLogin = state.mode === 'login';
  let title, form;

  state = {
    mode: 'login',
  };

  switch (state.mode) {
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
    <div className={styles.eventsDropdownEl}>
      <div className={styles.dropdownSection} data-first-dropdown-section>
        {title}
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
        {!isLogin && (
          <button onClick={this.toggleBack} className={styles.toggleButton}>
            Tilbake
          </button>
        )}
      </div>
      <div className={styles.dropdownSection}>{form}</div>
    </div>
  );
};

export default LoginDropdown;
