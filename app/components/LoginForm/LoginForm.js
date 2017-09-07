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
    username: '',
    password: '',
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
      if (this.state.username.trim() === '') {
        this.usernameRef.focus();
        return;
      }

      if (this.state.password.trim() === '') {
        this.passwordRef.focus();
        return;
      }

      this.setState({ submitting: true, error: false });
      this.props
        .login(this.state.username, this.state.password)
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
          placeholder="Brukernavn"
          value={this.state.username}
          onChange={e => this.setState({ username: e.target.value })}
          autoFocus
          style={{ marginBottom: 10 }}
          disabled={this.state.submitting}
        />

        <TextInput
          inputRef={ref => {
            this.passwordRef = ref;
          }}
          type="password"
          value={this.state.password}
          onChange={e => this.setState({ password: e.target.value })}
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
