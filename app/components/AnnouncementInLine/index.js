// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form, TextArea } from 'app/components/Form';
import { reduxForm, Field, reset } from 'redux-form';
import { createAnnouncement } from 'app/actions/AnnouncementsActions';
import styles from './AnnouncementInLine.css';

type Props = {
  placeholder?: string,
  event?: number,
  meeting?: number,
  group?: number,
  createAnnouncement: (...any) => void,
  handleSubmit: Function => void,
  actionGrant: boolean,
  hidden?: boolean
};

type State = {
  hidden: boolean
};

class AnnouncementInLine extends Component<Props, State> {
  props: Props;
  state = {
    hidden: true
  };

  onSubmit = (announcement, event, meeting, group) => {
    this.props.createAnnouncement({
      ...announcement,
      events: event ? [event] : [],
      meetings: meeting ? [meeting] : [],
      groups: group ? [group] : [],
      send: true
    });
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
      event,
      meeting,
      group
    } = this.props;
    return (
      <div>
        {actionGrant &&
          (event || meeting || group) && (
            <div>
              <a onClick={this.handleHide} className={styles.label}>
                Ny kunngjøring
              </a>
              {!this.state.hidden && (
                <Form
                  onSubmit={handleSubmit(values =>
                    this.onSubmit(values, event, meeting, group)
                  )}
                >
                  <Field
                    name="message"
                    component={TextArea.Field}
                    placeholder={placeholder || 'Skriv din kunngjøring her...'}
                    className={styles.field}
                  />
                  <Button submit className={styles.button}>
                    {' '}
                    SEND{' '}
                  </Button>
                </Form>
              )}
            </div>
          )}
      </div>
    );
  }
}

const resetForm = (result, dispatch) => {
  dispatch(reset('announcementInline'));
};

const mapStateToProps = state => ({ actionGrant: state.allowed.announcements });

const mapDispatchToProps = { createAnnouncement };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'announcementInline',
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
