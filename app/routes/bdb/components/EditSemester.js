import styles from './bdb.css';
import React, { Component } from 'react';
import CompanyRightNav from './CompanyRightNav';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextInput } from 'app/components/Form';
import { selectColorCode, statusStrings } from '../utils.js';
import LoadingIndicator from 'app/components/LoadingIndicator';
import cx from 'classnames';
import { Link } from 'react-router';

type Props = {
  editSemesterStatus: () => void,
  handleSubmit: () => void,
  company: Object,
  semester: Object,
  fields: any,
  submitting: boolean,
  autoFocus: any
};

export default class EditSemester extends Component {

  state = {
    contactedStatus: 0
  }

  componentWillReceiveProps(props) {
    this.setState({ contactedStatus: props.semesterStatus.contactedStatus });
  }

  onSubmit({ contactedStatus, contract }) {
    this.props.editSemesterStatus({
      companyId: this.props.company.id,
      semesterId: this.props.semester.id,
      value: contactedStatus,
      contract
    });
  }

  handleChange = (event) => {
    this.setState({
      contactedStatus: event.target.value
    });
  }

  props: Props;

  render() {
    const {
      company,
      semesterStatus,
      submitting,
      autoFocus
    } = this.props;

    if (!company) {
      return <LoadingIndicator />;
    }

    if (!semesterStatus) {
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

              <div className={cx(styles[selectColorCode(this.state.contactedStatus)],
                styles.semesterStatusForm)}
              >
                <select
                  name={'contactedStatus'}
                  value={this.state.contactedStatus}
                  onChange={this.handleChange}
                >
                  {Object.keys(statusStrings).map((statusString, j) => (
                    <option key={j} value={statusString}>{statusStrings[j]}</option>
                  ))}
                </select>
              </div>

              <Field
                placeholder={'Kontrakt for dette semesteret'}
                autoFocus={autoFocus}
                name='contract'
                component={TextInput.Field}
                className={styles.contractForm}
              />

              <div className={styles.clear}></div>
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

          <CompanyRightNav
            {...this.props}
            companyId={this.props.companyId}
          />

        </div>
      </div>
    );
  }
}
