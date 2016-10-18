import React, { Component } from 'react';
import { Form } from '../Form';
import Button from '../Button';

type Props = {
  login: (username: string, password: string) => any;
};

export default class LoginForm extends Component {
  props: Props;

  usernameRef: any;
  passwordRef: any;

  handleSubmit = (e) => {
    e.preventDefault();

    const username = this.usernameRef.value.trim();
    const password = this.passwordRef.value.trim();

    if (username === '') {
      this.usernameRef.focus();
      return;
    }

    if (password === '') {
      this.passwordRef.focus();
      return;
    }

    this.props.login(username, password);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className={this.props.className}>
        <input
          type='text'
          ref={(ref) => { this.usernameRef = ref; }}
          placeholder='Username'
          autoFocus
        />
        <input
          type='password'
          ref={(ref) => { this.passwordRef = ref; }}
          placeholder='Password'
        />
        <Button submit dark>Send</Button>
      </Form>
    );
  }
}
