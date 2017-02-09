import React, { Component } from 'react';
import cx from 'classnames';
import debounce from 'lodash/debounce';
import Icon from 'app/components/Icon';
import { Form, TextInput } from '../Form';
import Button from '../Button';

type Props = {
  login: (username: string, password: string) => any,
};

export default class LoginForm extends Component {
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

  login = debounce(() => {
    if (this.state.username.trim() === '') {
      this.usernameRef.focus();
      return;
    }

    if (this.state.password.trim() === '') {
      this.passwordRef.focus();
      return;
    }

    this.setState({ submitting: true, error: false });
    this.props.login(this.state.username, this.state.password)
      .then(
        () => this.mounted && this.setState({ submitting: false }),
        () => this.mounted && this.setState({ submitting: false, error: true })
      );
  }, 500, { leading: true });

  handleSubmit = (e) => {
    e.preventDefault();
    this.login();
  };

  render() {
    return (
      <Form
        onSubmit={this.handleSubmit}
        className={cx(
          this.props.className,
        )}
      >
        <TextInput
          inputRef={(ref) => { this.usernameRef = ref; }}
          placeholder='Username'
          value={this.state.username}
          onChange={(e) => this.setState({ username: e.target.value })}
          autoFocus
          style={{ marginBottom: 10 }}
        />

        <TextInput
          inputRef={(ref) => { this.passwordRef = ref; }}
          type='password'
          value={this.state.password}
          onChange={(e) => this.setState({ password: e.target.value })}
          placeholder='Password'
          style={{ marginBottom: 10 }}
        />

        <Button submit dark>
          Login
          {'  '}
          <Icon
            style={{ fontSize: 14, paddingTop: 3 }}
            name={this.state.submitting ? 'spinner spin' : 'chevron-right'}
          />
        </Button>
      </Form>
    );
  }
}
