//@flow
import React from 'react';
import {
  injectStripe,
  PaymentRequestButtonElement,
  Elements,
  StripeProvider,
} from 'react-stripe-elements';
import config from 'app/config';
import StripeCheckout from 'react-stripe-checkout';
import Button from 'app/components/Button';
import styles from './StripeElement.css';
import logoImage from 'app/assets/kule.png';
import type { EventRegistrationChargeStatus, User, Event } from 'app/models';

import { paymentPending } from '../utils';

type Props = {
  event: Event,
  currentUser: User,
  onToken: (token: string) => Promise<*>,
  chargeStatus: EventRegistrationChargeStatus,
};

type FormProps = Props & { stripe: { paymentRequest: (Object) => Object } };

type State = {
  paymentRequest: Object,
  canMakePayment?: boolean,
};

const paymentButtonWidth = 130;

class PaymentRequestForm extends React.Component<FormProps, State> {
  constructor(props) {
    super(props);

    const { event, onToken } = props;

    const paymentRequest = props.stripe.paymentRequest({
      currency: 'nok',
      total: {
        label: event.title,
        amount: event.price,
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
      country: 'NO',
    });

    paymentRequest.on('token', async ({ complete, token, ...data }) => {
      await onToken(token);
      complete('success');
    });

    paymentRequest.canMakePayment().then((result) => {
      this.setState({ canMakePayment: !!result });
    });

    this.state = {
      canMakePayment: undefined,
      paymentRequest,
    };
  }

  render() {
    const { chargeStatus, event, onToken, currentUser } = this.props;
    const showOverlay = chargeStatus === paymentPending;
    return (
      <div className={styles.overlayParent}>
        {showOverlay && (
          <div
            className={styles.overlay}
            style={{
              width: paymentButtonWidth,
            }}
          />
        )}
        {this.state.canMakePayment && (
          <div style={{ width: 130 }}>
            <PaymentRequestButtonElement
              paymentRequest={this.state.paymentRequest}
              className="PaymentRequestButton"
              style={{
                paymentRequestButton: {
                  height: '41px',
                },
              }}
            />
          </div>
        )}

        {this.state.canMakePayment === false && (
          <StripeCheckout
            name="Abakus"
            description={event.title}
            image={logoImage}
            currency="NOK"
            allowRememberMe
            locale="no"
            token={onToken}
            stripeKey={config.stripeKey}
            amount={event.price}
            email={currentUser.email}
          >
            <Button style={{ width: 130 }}>Betal nå</Button>
          </StripeCheckout>
        )}
      </div>
    );
  }
}
const InjectedForm = injectStripe(PaymentRequestForm);

// TODO Move this to a "global" thing
const WithProvider = (props: Props) => (
  <StripeProvider apiKey={config.stripeKey}>
    <Elements locale="no">
      <InjectedForm {...props} />
    </Elements>
  </StripeProvider>
);
export default WithProvider;
