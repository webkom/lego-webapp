

import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import React, { Component } from 'react';
import Button from 'app/components/Button';
import { Form, TextArea } from 'app/components/Form';
import { reduxForm, Field, reset } from 'redux-form';
import { createAnnouncement } from 'app/actions/AnnouncementsActions';
import styles from './AnnouncementInLine.css';
import { CreateAnnouncement, ID } from 'app/models';

interface Props {
  placeholder?: string,
  event?: ID,
  meeting?: ID,
  group?: ID,
  createAnnouncement: CreateAnnouncement => Promise<*>,
  handleSubmit: Function => void,
  actionGrant: boolean,
  hidden?: boolean,
  button?: boolean,
  className?: string
};

interface State {
  hidden: boolean,
  sent: boolean
};

class AnnouncementInLine extends Component<Props, State> {
  state = {
    hidden: true,
    sent: false
  };

  onSubmit = (announcement, event, meeting, group) => {
    this.props.createAnnouncement({
      ...announcement,
      events: event ? [event] : [],
      meetings: meeting ? [meeting] : [],
      groups: group ? [group] : [],
      send: true
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
      event,
      meeting,
      group,
      button,
      className
    } = this.props;

    const showButton = button && this.state.hidden && !this.state.sent;
    const showLabel = !button || !this.state.hidden || this.state.sent;
    const showForm = !this.state.hidden && !this.state.sent;

    return (
      <div>
        {actionGrant && (event || meeting || group) && (
          <div>
            {showButton && (
              <Button
                onClick={this.handleHide}
                className={styles.announcementButton}
              >
                Ny kunngjøring
              </Button>
            )}
            {showLabel && (
              <Button
                flat
                onClick={this.handleHide}
                className={cx(
                  button ? styles.labelButton : styles.label,
                  className
                )}
              >
                {!this.state.sent ? ' Ny kunngjøring ' : ' Kunngjøring sendt '}
              </Button>
            )}

            {showForm && (
              <Form
                onSubmit={handleSubmit(values =>
                  this.onSubmit(values, event, meeting, group)
                )}
              >
                <Field
                  name="message"
                  component={TextArea.Field}
                  placeholder={placeholder || 'Skriv din kunngjøring her...'}
                  fieldClassName={styles.field}
                  className={styles.fieldText}
                />
                <Button submit className={styles.button}>
                  SEND
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
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
