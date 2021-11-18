// @flow
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';
import cx from 'classnames';
import { Component } from 'react';
import Button from 'app/components/Button';
import { Form, TextArea } from 'app/components/Form';
import { reduxForm, Field, reset } from 'redux-form';
import { createAnnouncement } from 'app/actions/AnnouncementsActions';
import styles from './AnnouncementInLine.css';
import type { ID } from 'app/models';

type Props = {
  placeholder?: string,
  event?: ID,
  meeting?: ID,
  group?: ID,
  createAnnouncement: (CreateAnnouncement) => Promise<*>,
  handleSubmit: (Function) => void,
  actionGrant: boolean,
  hidden?: boolean,
  button?: boolean,
  className?: string,
};

type State = {
  hidden: boolean,
  sent: boolean,
};

class AnnouncementInLine extends Component<Props, State> {
  state = {
    hidden: true,
    sent: false,
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
      className,
    } = this.props;

    const showButton = button && this.state.hidden && !this.state.sent;

    return (
      <div>
      {actionGrant && (event || meeting || group) && (
        <div>
          {showButton && (
            <Link to={"/announcements"} state={{event, meeting}}>
            <Button
              className={styles.announcementButton}
            >
              Ny kunngjøring
            </Button>
            </Link>
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

const mapStateToProps = (state) => ({
  actionGrant: state.allowed.announcements,
});

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
    },
  })
)(AnnouncementInLine);
