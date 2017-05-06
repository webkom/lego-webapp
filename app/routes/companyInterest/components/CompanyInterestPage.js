import React, { Component } from 'react';
import styles from 'app/routes/companyInterest/components/CompanyInterest.css';
import { TextEditor, TextInput, Button, CheckBox } from 'app/components/Form';
import { Field } from 'redux-form';
import { ImageUpload } from 'app/components/Upload';

const EVENT_TYPES = [
  { label: 'Bedriftspresentasjon', name: 'companyPresentation' },
  { label: 'Kurs', name: 'course' },
  { label: 'Lunsjpresentasjon', name: 'lunchPresentation' }
];

const ACTIVITY_TYPES = [
  { label: 'Annonsere i readme', name: 'readme' },
  { label: 'Samarbeid med andre linjeforeninger', name: 'collaboration' },
  { label: 'Bedex', name: 'bedex' },
  { label: 'Ønsker stand på itDAGENE', name: 'itdagene' }
];

const isFirstSemester = () => new Date().getMonth() + 1 < 6;

const getInputField = (label, placeholder, name) => (
  <div>
    <b className="smallHeading">
      <label htmlFor={name} className={styles.smallHeading}>
        {label}
      </label>
    </b>

    <div className={styles.inputField}>
      <Field
        className={styles.textInput}
        placeholder={placeholder}
        name={name}
        component={TextInput.Field}
      />
    </div>
  </div>
);

const getSemesterBoxes = () => {
  const currentYear = new Date().getFullYear();
  const labels = isFirstSemester
    ? [
        `Høst ${currentYear}`,
        `Vår ${currentYear + 1}`,
        `Høst ${currentYear + 1}`,
        `Vår ${currentYear + 2}`
      ]
    : [
        `Vår ${currentYear + 1}`,
        `Høst ${currentYear + 1}`,
        `Vår ${currentYear + 2}`,
        `Høst ${currentYear + 2}`
      ];

  return labels.map((item, index) => (
    <div className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          key={`semester${index}`}
          id={`semester${index}`}
          name={`semester${index}`}
          component={CheckBox.Field}
        />
      </div>
      <span className={styles.checkboxSpan}>{item}</span>
    </div>
  ));
};

const getEventBoxes = () =>
  EVENT_TYPES.map((item, index) => (
    <div className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          id={`event-${index}`}
          key={`event-${index}`}
          name={item.name}
          component={CheckBox.Field}
        />
      </div>
      <span className={styles.checkboxSpan}>{item.label}</span>
    </div>
  ));

const getActivityBoxes = () =>
  ACTIVITY_TYPES.map((item, index) => (
    <div className={styles.checkbox}>
      <div className={styles.checkboxField}>
        <Field
          id={`event-${index}`}
          key={`activity-${index}`}
          name={item.name}
          component={CheckBox.Field}
        />
      </div>
      <span className={styles.checkboxActivitySpan}>{item.label}</span>
    </div>
  ));

type Props = {
  createCompanyInterest: () => void,
  handleSubmit: () => void
};

export default class CompanyInterestPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      semesters: getSemesterBoxes(),
      events: getEventBoxes(),
      activities: getActivityBoxes()
    };
  }
  props: Props;

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className={styles.root}>
        <form onSubmit={handleSubmit}>
          <h1 className={styles.mainHeading}>{'Meld interesse'}</h1>
          <div className={styles.nameField}>
            {getInputField('Navn på bedrift', 'Bedriftsnavn', 'companyName')}
            {getInputField('Kontaktperson', 'Ola Nordmann', 'contactPerson')}
          </div>
          {getInputField('E-post', 'example@domain.com', 'mail')}
          <div className={styles.checkboxWrapper}>

            <div id="semester">
              <b className="smallHeading">
                <label htmlFor="semester" className={styles.heading}>
                  Semester
                </label>
              </b>
              {this.state.semesters}
            </div>

            <div id="arrangementer">
              <b className="smallHeading">
                <label htmlFor="arrangementer" className={styles.heading}>
                  Arrangementer
                </label>
              </b>
              {this.state.events}
            </div>

            <div id="extra">
              <b className="smallHeading">
                <label htmlFor="extra" className={styles.heading}>Annet</label>
              </b>
              {this.state.activities}
            </div>
          </div>

          <b className="smallHeading">
            <label htmlFor="comment" className={styles.smallHeading}>
              Kommentar
            </label>
          </b>

          <div className={styles.textEditor}>
            <Field
              placeholder="Skriv eventuell kommentar"
              name="comment"
              component={TextEditor.Field}
            />
          </div>

          <div className={styles.content}>
            <div className={styles.upload}>
              <ImageUpload>Last opp bilde</ImageUpload>
            </div>
            <Button type="submit" className={styles.smallHeading}>
              {'Opprett bedriftsinteresse'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
