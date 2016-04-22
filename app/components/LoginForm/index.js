import React, { Component } from 'react';
import { Form } from '../Form';
import Button from '../Button';

type Props = {
  login: (username: string, password: string) => any;
};

export default class LoginForm extends Component {
  props: Props;

  handleSubmit = (e) => {
    e.preventDefault();

    const username = this.refs.username.value.trim();
    const password = this.refs.password.value.trim();

    if (username === '') {
      this.refs.username.focus();
      return;
    }

    if (password === '') {
      this.refs.password.focus();
      return;
    }

    this.props.login(username, password);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit} className={this.props.className}>
        <input
          type='text'
          ref='username'
          placeholder='Username'
          autoFocus
        />
        <input
          type='password'
          ref='password'
          placeholder='Password'
        />
        <Button submit dark>Logg inn</Button>
      </Form>
    );
  }
}
