import styles from './bdb.css';
import React, { Component } from 'react';
import BdbRightNav from './BdbRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import { selectColorCode, statusStrings, trueIcon, falseIcon } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import cx from 'classnames';
import { Link } from 'react-router';

type Props = {
  editSemesterStatus: () => void,
  handleSubmit: () => void,
  company: Object,
  semesterStatus: Object,
  fields: any,
  submitting: boolean,
  autoFocus: any
};

export default class EditSemester extends Component {

  state = {
    contactedStatus: -1
  }

  onSubmit({ contactedStatus, contract }) {
    const { company, semesterStatus } = this.props;
    this.props.editSemesterStatus({
      companyId: company.id,
      semesterId: semesterStatus.id,
      value: contactedStatus,
      contract: contract || ''
    }, true);
  }

  componentWillReceiveProps(newProps) {
    console.log('mounting');
    if (newProps) {
      console.log('props');
      console.log(newProps);
      console.log(this.state);
      if (this.state.contactedStatus === -1) {
        this.setState({ contactedStatus: newProps.semesterStatus.contactedStatus });
      }
    }
  }

  setContactedStatus = (event) => {
    this.setState({
      contactedStatus: event.target.value
    });
  }

  props: Props;

  render() {
    console.log('***');
    console.log(this.props);
    const {
      company,
      semesterStatus,
      submitting,
      autoFocus
    } = this.props;

    if (!company || !semesterStatus) {
      return <LoadingIndicator />;
    }

    return (
      <div className={styles.root}>

        <h1>Endre semester</h1>
        <i><Link to={`/bdb/${company.id}`}>{company.name}</Link> sin status for
          <b>{semesterStatus.semester === 0 ? ' Vår' : ' Høst'} {semesterStatus.year}</b>
        </i>

        <div className={styles.detail}>
          <div className={styles.leftSection}>

            <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

              <Field
                placeholder={'Kontrakt for dette semesteret'}
                autoFocus={autoFocus}
                name='contract'
                component={TextInput.Field}
                className={styles.contractForm}
              />

              <div
                className={cx(styles[selectColorCode(this.state.contactedStatus)],
                styles.contactedStatusForm)}
              >
                <select
                  name={'contactedStatus'}
                  value={this.state.contactedStatus}
                  onChange={this.setContactedStatus}
                >
                  {Object.keys(statusStrings).map((statusString, j) => (
                    <option key={j} value={statusString}>{statusStrings[j]}</option>
                  ))}
                </select>
              </div>

              <div className={styles.clear} />
              <Button
                className={styles.submit}
                disabled={submitting}
                submit
                style={{ marginBottom: '0!important' }}
              >
                Lagre
              </Button>

            </form>
          </div>

          <BdbRightNav
            {...this.props}
            companyId={this.props.companyId}
          />

        </div>
      </div>
    );
  }
}
