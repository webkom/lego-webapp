import React, { Component } from 'react';
import cx from 'classnames';
import { debounce } from 'lodash';
import { Form, TextInput } from '../Form';
import Button from '../Button';
import { login } from 'app/actions/UserActions';
import { connect } from 'react-redux';

type Props = {
  login: (username: string, password: string) => any
};

class LoginForm extends Component {
  state = {
    submitted: false,
    submitting: false,
    error: false
  };

  props: Props;

  usernameRef: any;
  passwordRef: any;
  mounted = false;

  componentDidMount() {
    this.mounted = true;
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  login = debounce(
    () => {
      const username = this.usernameRef.value.trim();
      const password = this.passwordRef.value;
      if (username === '') {
        this.usernameRef.focus();
        return;
      }

      if (password.trim() === '') {
        this.passwordRef.focus();
        return;
      }

      this.setState({ submitting: true, error: false });
      this.props
        .login(username, password)
        .then(
          () => this.mounted && this.setState({ submitting: false }),
          () =>
            this.mounted && this.setState({ submitting: false, error: true })
        );
    },
    500,
    { leading: true }
  );

  handleSubmit = e => {
    e.preventDefault();
    this.login();
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className={cx(this.props.className)}>
        <TextInput
          inputRef={ref => {
            this.usernameRef = ref;
          }}
          name="username"
          placeholder="Brukernavn"
          autoFocus
          style={{ marginBottom: 10 }}
          disabled={this.state.submitting}
        />

        <TextInput
          inputRef={ref => {
            this.passwordRef = ref;
          }}
          name="password"
          type="password"
          placeholder="Passord"
          style={{ marginBottom: 10 }}
          disabled={this.state.submitting}
        />

        <Button submit disabled={this.state.submitting} dark>
          Logg inn
        </Button>
      </Form>
    );
  }
}

export default connect(null, { login })(LoginForm);
