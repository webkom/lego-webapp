import React from 'react';
import { FlexRow, FlexColumn } from 'app/components/FlexBox';
import styles from './JoblistingEditor.css';
import { Field } from 'redux-form';
import { TextInput, DatePicker, EditorField } from 'app/components/Form';

export const DatePickerComponent = ({ text, name }) =>
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>
      {`${text} `}
    </FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field name={name} component={DatePicker.Field} />
    </FlexColumn>
  </FlexRow>;

export const YearPickerComponent = ({ text, name }) =>
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>
      {text}
    </FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field name={name} component="select">
        <option value="1">1</option>
        <option value="2">2</option>
        <option value="3">3</option>
        <option value="4">4</option>
        <option value="5">5</option>
      </Field>
    </FlexColumn>
  </FlexRow>;

export const FieldComponent = ({ text, name, placeholder }) =>
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>
      {text}
    </FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field
        placeholder={placeholder}
        name={name}
        component={TextInput.Field}
      />
    </FlexColumn>
  </FlexRow>;

export const TextEditorComponent = ({ text, name, placeholder }) =>
  <FlexRow className={styles.row}>
    <FlexColumn className={styles.des}>
      {text}{' '}
    </FlexColumn>
    <FlexColumn className={styles.textfield}>
      <Field name={name} component={EditorField} placeholder={placeholder} />
    </FlexColumn>
  </FlexRow>;
