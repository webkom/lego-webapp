// @flow

import React, { Component } from 'react';
import { Form, TextEditor } from 'app/components/Form';
import Button from 'app/components/Button';
import StripeCheckout from 'react-stripe-checkout';
import logoImage from 'app/assets/kule.png';

export type Props = {
  title: string,
  event: Event,
  registration: Object,
  currentUser: Object,
  onSubmit: void,
  onToken: void,
}

export default class JoinEventForm extends Component {
  state = {
    messageToOrganizers: ''
  };

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.onSubmit(this.state.messageToOrganizers);
  };

  render() {
    const { title, onToken, event, registration, currentUser } = this.props;
    const joinTitle = !registration ? 'MELD DEG PÅ' : 'AVREGISTRER';
    return (
      <div>
        <Form onSubmit={this.handleSubmit}>
          <TextEditor
            placeholder='Melding til arrangører (allergier etc)'
            onChange={(e) => this.setState({ messageToOrganizers: e.target.value })}
            value={this.state.messageToOrganizers}
          />
          <Button submit>
            {title || joinTitle}
          </Button>
        </Form>
        {registration && !registration.chargeStatus && event.isPriced && (
          <StripeCheckout
            name='Abakus Linjeforening'
            description={event.title}
            image={logoImage}
            currency='NOK'
            allowRememberMe={false}
            locale='no'
            token={onToken}
            stripeKey='pk_test_VWJmJ3yOunhMBkG71SXyjdqk'
            amount={event.price}
            email={currentUser.email}
          >
            <Button>Betal nå</Button>
          </StripeCheckout>
        )}
      </div>
    );
  }
}
