import styles from './joblistings.css';
import React, { Component } from 'react';
import { Field } from 'redux-form';
import Button from 'app/components/Button';
import { TextEditor, TextInput } from 'app/components/Form';
import moment from 'moment';

type Props = {
  addJoblisting: () => void,
  fields: any,
  submitting: boolean,
  handleSubmit: () => void,
  autoFocus: any
};

export default class AddCompany extends Component {

  onSubmit({ title, text, company, responsible, description, deadline,
    visibleFrom, visibleTo, jobType, workplaces, fromYear, toYear,
    applicationUrl }) {
    this.props.createJoblisting({
      title,
      text,
      company,
      responsible,
      description,
      deadline: moment(deadline).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
      visibleFrom: moment(visibleFrom).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
      visibleTo: moment(visibleTo).utc().format('YYYY-MM-DD[T]HH:MM:SS[Z]'),
      jobType,
      workplaces,
      fromYear,
      toYear,
      applicationUrl
    });
  }

  props: Props;

  render() {
    const {
      submitting,
      autoFocus
    } = this.props;

    return (
      <div className={styles.root}>

        <Field
          placeholder={'Tittel'}
          autoFocus={autoFocus}
          name='title'
          component={TextInput.Field}
          className={styles.editTitle}
        />

        <div className={styles.detail}>
          <div className={styles.leftSection}>

            <form onSubmit={this.props.handleSubmit(this.onSubmit.bind(this))}>

              <div className={styles.company}>
                <Field
                  placeholder={'Bedrift'}
                  autoFocus={autoFocus}
                  name='company'
                  component={TextEditor.Field} // Get companies from backend, fix later
                />
              </div>

              <div className={styles.description}>
                <Field
                  placeholder={'Beskrivelse av jobb'}
                  autoFocus={autoFocus}
                  name='description'
                  component={TextEditor.Field}
                />
              </div>

              <div className={styles.clear} />
              <Button
                className={styles.submit}
                disabled={submitting}
                submit
              >
                Lagre
              </Button>

            </form>
          </div>

          <BdbRightNav
            {...this.props}
          />

        </div>
      </div>
    );
  }
}
