import React, { Component } from 'react';
import { Form, TextField } from 'app/components/Form';
import Button from 'app/components/Button';

export default class JoinEventForm extends Component {
  state = {
    messageToOrganizers: ''
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.messageToOrganizers);
  };

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        <TextField
          placeholder='Melding til arrangører (allergier etc)'
          onChange={(e) => this.setState({ messageToOrganizers: e.target.value })}
          value={this.state.messageToOrganizers}
        />
        <Button submit>
          Meld deg på
        </Button>
      </Form>
    );
  }
}
