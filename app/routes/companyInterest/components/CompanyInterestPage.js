// @flow
import React from 'react';
import { interestText, semesterToText } from '../utils';
import styles from './CompanyInterest.css';
import {
  TextEditor,
  TextInput,
  Button,
  CheckBox,
  SelectInput,
  Form
} from 'app/components/Form';
import { Image } from 'app/components/Image';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { reduxForm, Field, SubmissionError, FieldArray } from 'redux-form';
import type { FieldProps } from 'redux-form';
import Flex from 'app/components/Layout/Flex';
import { Content } from 'app/components/Content';
import type { CompanyInterestEntity } from 'app/reducers/companyInterest';
import type { CompanySemesterEntity } from 'app/reducers/companySemesters';

import { createValidator, required, isEmail } from 'app/utils/validation';
import { FlexRow } from '../../../components/FlexBox';
import { Link } from 'react-router';
import norwegian from 'app/assets/norway.svg';
import english from 'app/assets/great_britain.svg';
import withAutocomplete from 'app/components/Search/withAutocomplete';

export const EVENT_TYPES = {
  company_presentation: {
    norwegian: 'Bedriftspresentasjon',
    english: 'Company presentation'
  },
  lunch_presentation: {
    norwegian: 'Lunsjpresentasjon',
    english: 'Lunch presentation'
  },
  course: {
    norwegian: 'Faglig arrangement',
    english: 'Course or workshop'
  },
  bedex: {
    norwegian: 'Bedex',
    english: 'BedEx'
  },
  other: {
    norwegian: 'Alternativt arrangement',
    english: 'Other event'
  },
  start_up: {
    norwegian: 'Start-up kveld',
    english: 'Start-up night'
  }
};

export const OTHER_TYPES = {
  readme: {
    norwegian: 'Annonsere i readme',
    english: 'Advertisement in readme'
  },
  collaboration: {
    norwegian: 'Samarbeid med andre linjeforeninger',
    english: `Event in collaboration with other student organizations`
  }
};

const eventToString = event =>
  Object.keys(EVENT_TYPES)[Number(event.charAt(event.length - 2))];

const otherOffersToString = offer =>
  Object.keys(OTHER_TYPES)[Number(offer.charAt(offer.length - 2))];

const SemesterBox = ({ fields, language }: FieldProps) => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((item, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`semester${index}`}
              name={`semesters[${index}].checked`}
              component={CheckBox.Field}
              normalize={v => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {semesterToText({ ...fields.get(index), language })}
          </span>
        </label>
      </Flex>
    ))}
  </Flex>
);

const EventBox = ({ fields, language }: FieldProps) => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`events[${index}]`}
              name={`events[${index}].checked`}
              component={CheckBox.Field}
              normalize={v => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {EVENT_TYPES[eventToString(key)][language]}
          </span>
        </label>
      </Flex>
    ))}
  </Flex>
);

const OtherBox = ({ fields, language }: FieldProps) => (
  <Flex column className={styles.checkboxWrapper}>
    {fields.map((key, index) => (
      <Flex key={index}>
        <label className={styles.checkboxLabel}>
          <div className={styles.checkboxField}>
            <Field
              key={`otherOffers[${index}]`}
              name={`otherOffers[${index}].checked`}
              component={CheckBox.Field}
              normalize={v => !!v}
            />
          </div>
          <span className={styles.checkboxSpan}>
            {OTHER_TYPES[otherOffersToString(key)][language]}
          </span>
        </label>
      </Flex>
    ))}
  </Flex>
);

const LanguageFlag = ({ language }: { language: string }) => {
  let flag;
  switch (language) {
    case 'english':
      flag = norwegian;
      break;
    case 'norwegian':
      flag = english;
      break;
  }
  return <Image src={flag} className={styles.flag} alt="country_flag" />;
};

type Props = FieldProps & {
  allowedBdb: boolean,
  onSubmit: CompanyInterestEntity => Promise<*>,
  push: string => void,
  events: Array<Object>,
  semesters: Array<CompanySemesterEntity>,
  otherOffers: Array<Object>,
  edit: boolean,
  companyInterest?: CompanyInterestEntity,
  language: string
};

const CompanyInterestPage = (props: Props) => {
  if (props.edit && !props.companyInterest) {
    return <LoadingIndicator loading />;
  }

  const onSubmit = data => {
    const { company } = data;
    const companyId = company['value'] ? Number(company['value']) : null;
    const companyName = companyId === null ? company['label'] : '';

    const newData = {
      companyName: companyName,
      company: companyId,
      contactPerson: data.contactPerson,
      mail: data.mail,
      phone: data.phone,
      semesters: data.semesters
        .filter(semester => semester.checked)
        .map(semester => semester.id),
      events: data.events
        .filter(event => event.checked)
        .map(event => event.name),
      otherOffers: data.otherOffers
        .filter(offer => offer.checked)
        .map(offer => offer.name),
      comment: data.comment
    };

    return props
      .onSubmit(newData, isEnglish)
      .then(() =>
        props.push(
          props.allowedBdb
            ? '/companyInterest/'
            : '/pages/bedrifter/for-bedrifter'
        )
      )
      .catch(err => {
        if (err.payload && err.payload.response) {
          throw new SubmissionError(err.payload.response.jsonData);
        }
      });
  };

  const labels = {
    mainHeading: {
      norwegian: 'Meld interesse',
      english: 'Contact us'
    },
    company: {
      header: {
        norwegian: 'Navn på bedrift',
        english: 'Company'
      },
      placeholder: {
        norwegian: 'Bedriftsnavn',
        english: 'Company name'
      }
    },
    contactPerson: {
      header: {
        norwegian: 'Kontaktperson',
        english: 'Your contact person'
      },
      placeholder: {
        norwegian: 'Kari Nordmann',
        english: 'Jon Smith'
      }
    },
    mail: {
      norwegian: 'Mail',
      english: 'E-Mail'
    },
    phone: {
      norwegian: 'Telefonnummer',
      english: 'Phone number'
    },
    semester: {
      norwegian: 'Semester',
      english: 'Semester'
    },
    events: {
      norwegian: 'Arrangementer',
      english: 'Events'
    },
    otherOffers: {
      norwegian: 'Annet',
      english: 'Other'
    },
    comment: {
      norwegian: 'Kommentar',
      english: 'Comment'
    },
    create: {
      norwegian: 'Opprett bedriftsinteresse',
      english: 'Submit'
    }
  };

  const { language } = props;
  const isEnglish = language === 'english';

  return (
    <Content>
      <Form onSubmit={props.handleSubmit(onSubmit)}>
        <FlexRow alignItems={'center'} justifyContent={'space-between'}>
          <h1 className={styles.mainHeading}>{labels.mainHeading[language]}</h1>
          <Link
            to={isEnglish ? '/interesse' : '/register-interest'}
            style={{ display: props.edit ? 'none' : 'block' }}
          >
            <LanguageFlag language={language} />
          </Link>
        </FlexRow>

        <Field
          name="company"
          label={labels.company.header[language]}
          placeholder={labels.company.placeholder[language]}
          filter={['companies.company']}
          fieldClassName={styles.metaField}
          component={withAutocomplete(SelectInput.Field, true)}
          required
        />
        <Field
          label={labels.contactPerson.header[language]}
          placeholder={labels.contactPerson.placeholder[language]}
          name="contactPerson"
          component={TextInput.Field}
          required
        />
        <Field
          label={labels.mail[language]}
          placeholder="example@gmail.com"
          name="mail"
          component={TextInput.Field}
          required
        />
        <Field
          label={labels.phone[language]}
          placeholder="+47 909 09 090"
          name="phone"
          component={TextInput.Field}
          required
        />

        <Flex wrap justifyContent="space-between">
          <Flex column className={styles.interestBox}>
            <label htmlFor="semesters" className={styles.heading}>
              {labels.semester[language]}
            </label>
            <FieldArray
              label="semesters"
              name="semesters"
              language={language}
              component={SemesterBox}
            />
          </Flex>

          <Flex column className={styles.interestBox}>
            <label htmlFor="events" className={styles.heading}>
              {labels.events[language]}
            </label>
            <FieldArray
              name="events"
              language={language}
              component={EventBox}
            />
          </Flex>

          <Flex column className={styles.interestBox}>
            <label htmlFor="otherOffers" className={styles.heading}>
              {labels.otherOffers[language]}
            </label>
            <FieldArray
              name="otherOffers"
              language={language}
              component={OtherBox}
            />
          </Flex>
        </Flex>

        <div className={styles.underline}>
          {interestText.text.first[language]}
          <br />
          <br />
          {interestText.text.second[language]}
          <br />
          <br />
          {interestText.bedex[language]}
        </div>

        <Field
          placeholder={interestText.comment[language]}
          name="comment"
          component={TextEditor.Field}
          rows={10}
          className={styles.textEditor}
          label={labels.comment[language]}
          required
        />

        <Flex column className={styles.content}>
          <Button type="submit" submit>
            {props.edit
              ? 'Oppdater bedriftsinteresse'
              : labels.create[language]}
          </Button>
        </Flex>
      </Form>
    </Content>
  );
};

const validate = createValidator({
  company: [required()],
  contactPerson: [required()],
  mail: [required(), isEmail()],
  phone: [required()],
  comment: [required()]
});

export default reduxForm({
  form: 'CompanyInterestForm',
  validate,
  enableReinitialize: true,
  keepDirtyOnReinitialize: true
})(CompanyInterestPage);
