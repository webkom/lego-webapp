import React, { Component } from 'react';
import styles from 'app/routes/interestgroups/components/InterestGroup.css';
import companyStyle
  from 'app/routes/companyInterest/components/CompanyInterest.css';
import { TextEditor, TextInput, Button, CheckBox } from 'app/components/Form';
import { Field } from 'redux-form';
import { ImageUpload } from 'app/components/Upload';

const EVENT_TYPES = [
  { label: 'Bedriftspresentasjon', name: 'bedpres' },
  { label: 'Kurs', name: 'course' },
  { label: 'Lunsjpresentasjon', name: 'lunch' }
];

const ACTIVITY_TYPES = [
  { label: 'Annonsere i readme', name: 'readme' },
  { label: 'Samarbeid med andre linjeforeninger', name: 'collaboration' },
  { label: 'Bedex', name: 'bedex' },
  { label: 'Ønsker stand på itDAGENE', name: 'itdagene' }
];

// let { id, label } = { id: "dsadsa" , label: "bar" , foo: "bar" };
// <=>
// let { id , label } = props;
/*
const Checkbox = ({ id, name, label }) => (
  <div>
    <Field
      id={id}
      name={name}
      component={CheckBox.Field}
    />
    <span>{label}</span>
  </div>
);
*/

const isFirstSemester = () => new Date().getMonth() + 1 < 6;

const getInputField = (label, placeholder, name) => (
  <div>
    <b className="smallHeading">
      <label htmlFor={name} className={companyStyle.smallHeading}>
        {label}
      </label>
    </b>

    <Field
      className={styles.textInput}
      placeholder={placeholder}
      name={name}
      component={TextInput.Field}
    />
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
    <CheckBox
      id={`semester-${index}`}
      key={`semester-${index}`}
      label={item}
      name={`semester-${index}`}
    />
  ));
};

const getEventBoxes = () =>
  EVENT_TYPES.map((item, index) => (
    <div>
      <Field key={index} name={item.name} component={CheckBox.Field} />
      <span>{item.label}</span>
    </div>
  ));

// React.createElement(Checkbox, { id: 'dsadsa', label: item })

const getActivityBoxes = () =>
  ACTIVITY_TYPES.map((item, index) => (
    <div>
      <Field key={index} name={item.name} component={CheckBox.Field} />
      <span>{item.label}</span>
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

  onSubmit = ({ companyName, personName, mail, comment }) =>
    this.props.createCompanyInterest(
      companyName,
      personName,
      mail,
      comment,
      this.state.semesterList,
      this.state.eventList
    );

  props: Props;

  render() {
    const { handleSubmit } = this.props;
    return (
      <div className={styles.root}>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <h1 className={companyStyle.mainHeading}>{'Meld interesse'}</h1>
          {getInputField('Navn på bedrift', 'Bedriftsnavn', 'companyName')}
          {getInputField('Kontaktperson', 'Martin Mc Kulesen', 'contactPerson')}
          {getInputField('E-post', 'example@domain.com', 'contactPerson')}
          <div className={companyStyle.checkboxWrapper}>

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
            <label htmlFor="comment" className={companyStyle.smallHeading}>
              Kommentar
            </label>
          </b>
          <Field
            className={styles.textEditor}
            placeholder="Skriv eventuell kommentar"
            name="comment"
            component={TextEditor.Field}
          />

          <div className={styles.content}>
            <div className={styles.upload}>
              <ImageUpload>Last opp bilde</ImageUpload>
            </div>
            <Button type="submit" className={companyStyle.smallHeading}>
              {'Opprett bedriftsinteresse'}
            </Button>
          </div>
        </form>
      </div>
    );
  }
}
