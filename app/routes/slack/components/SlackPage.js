// @flow
import React, { Component } from 'react'
import Helmet from 'react-helmet';
import { Field } from 'redux-form';

import Icon from 'app/components/Icon';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import { Form, TextInput } from 'app/components/Form';
import Button from 'app/components/Button';
import LinkButton from 'app/components/Button/LinkButton';
import styles from './SlackPage.css';

type Props = {
  handleSubmit: () => void,
  inviteUser: () => void,
  invalid: boolean,
  pristine: boolean,
  submitting: boolean,
};

class SlackPage extends Component {
  props: Props;

  render() {
    const {
      invalid,
      pristine,
      submitting
    } = this.props;


    const disabledButton = invalid || pristine || submitting;

    return (
      <div className={styles.root}>
        <Helmet title='Slack' />
        <FlexRow>
          <h2><Icon name='slack' /> Slack</h2>
        </FlexRow>
        <FlexRow>
          <p>
            Abakus has its own Slack team. It is called <code>abakus-ntnu</code>.
          </p>
        </FlexRow>
        <FlexRow justifyContent='space-around' alignItems='center'>
          <FlexColumn>
            <LinkButton dark target='_blank' href='https://abakus-ntnu.slack.com'><Icon name='slack' />Open Slack</LinkButton>
          </FlexColumn>
          <FlexColumn>
            <Form onSubmit={this.props.handleSubmit(this.props.inviteUser)} className={styles.form}>
              <Field
                placeholder='email@address.no'
                name='email'
                component={TextInput.Field}
              />
              <Button
                disabled={disabledButton}
                submit
              >
                Invite User
              </Button>
            </Form>
          </FlexColumn>
        </FlexRow>
      </div>
    );
  }

}

export default SlackPage;
