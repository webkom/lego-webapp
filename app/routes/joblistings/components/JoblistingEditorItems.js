import React from 'react';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import styles from './JoblistingEditor.css';
import { Field } from 'redux-form';
import {
  TextInput,
  SelectInput,
  DatePicker,
  EditorField
} from 'app/components/Form';
import { yearValues } from '../constants';

export const DatePickerComponent = ({ text, name }) => (
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>{`${text} `}</FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field name={name} component={DatePicker.Field} />
    </FlexColumn>
  </FlexRow>
);

export const YearPickerComponent = ({ text, name }) => (
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>{text}</FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field
        name={name}
        component={SelectInput.Field}
        placeholder="Jobbtype"
        simpleValue
        options={yearValues}
      />
    </FlexColumn>
  </FlexRow>
);

export const FieldComponent = ({ text, name, placeholder }) => (
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>{text}</FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field
        placeholder={placeholder}
        name={name}
        component={TextInput.Field}
      />
    </FlexColumn>
  </FlexRow>
);

export const TextEditorComponent = ({ text, name, placeholder }) => (
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>{text} </FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field name={name} component={EditorField} placeholder={placeholder} />
    </FlexColumn>
  </FlexRow>
);
