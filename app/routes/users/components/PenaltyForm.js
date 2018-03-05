// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames'; //???
import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form, TextArea, TextInput, SelectInput } from 'app/components/Form';
import { reduxForm, Field, reset } from 'redux-form';
import { addPenalty } from 'app/actions/UserActions';
import type { AddPenalty, ID } from 'app/models';

type Props = {
  placeholder?: string,
  user: ID,
  addPenalty: AddPenalty => Promise<*>,
  reason?: string,
  weight?: number,
  handleSubmit: Function => void,
  actionGrant: boolean,
  hidden?: boolean,
  button?: boolean,
  className?: string
};

type State = {
  hidden: boolean,
  sent: boolean
};

class AnnouncementInLine extends Component<Props, State> {
  props: Props;
  state = {
    hidden: true,
    sent: false
  };

  onSubmit = (penalty, user) => {
    //?
    this.props.addPenalty({
      ...penalty,
      sourceEvent: penalty.sourceEvent.value,
      user
    });
    this.setState(() => ({
      sent: true
    }));
  };

  handleHide = () => {
    this.setState(prevState => ({
      hidden: !prevState.hidden
    }));
  };

  render() {
    const {
      actionGrant,
      handleSubmit,
      placeholder,
      user,
      button,
      className
    } = this.props;

    const showButton = button && this.state.hidden && !this.state.sent;
    const showLabel = !button || !this.state.hidden || this.state.sent;
    const showForm = !this.state.hidden && !this.state.sent;

    return (
      <div>
        {actionGrant && (
          <div>
            {showButton && (
              <Button onClick={this.handleHide}>Ny kunngjøring</Button>
            )}
            {showLabel && (
              <div>
                {!this.state.sent ? (
                  <a onClick={this.handleHide} className={cx(className)}>
                    Lag ny prikk
                  </a>
                ) : (
                  <i>Prikken er registrert</i>
                )}
              </div>
            )}

            {showForm && (
              <Form
                onSubmit={handleSubmit(values => this.onSubmit(values, user))}
              >
                <Field
                  name="reason"
                  component={TextArea.Field}
                  placeholder={
                    placeholder || 'Skriv din begrunnelse for prikk...'
                  }
                />
                <Field //Nytt
                  name="weight"
                  component={TextInput.Field}
                  placeholder={placeholder || 'Hvor tungt vektlegges prikken?'}
                />
                <Field
                  name="sourceEvent"
                  placeholder="Arrangementer"
                  filter={['events.event']}
                  component={SelectInput.AutocompleteField}
                />
                <Button submit>LAG PRIKK</Button>
              </Form>
            )}
          </div>
        )}
      </div>
    );
  }
}

const resetForm = (result, dispatch) => {
  dispatch(reset('penaltyInline'));
};

const mapStateToProps = state => ({ actionGrant: state.allowed.penalties });

const mapDispatchToProps = { addPenalty };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'penaltyInline',
    onSubmitSuccess: resetForm,
    validate(values) {
      const errors = {};
      if (!values.message) {
        errors.message = 'Du må skrive en melding';
      }
      return errors;
    }
  })
)(AnnouncementInLine);
