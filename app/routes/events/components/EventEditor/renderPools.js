// @flow
import React from 'react';
import styles from './EventEditor.css';
import { Field } from 'redux-form';
import {
  TextInput,
  DatePicker,
  SelectInput,
  Button
} from 'app/components/Form';

import moment from 'moment';

type poolProps = {
  fields: Object,
  autocompleteResult: Object,
  groupQueryChanged: (query: string) => void,
  searching: boolean
};

const renderPools = ({
  fields,
  autocompleteResult,
  groupQueryChanged,
  searching
}: poolProps) => (
  <ul>
    {fields.map((pool, index) => (
      <li key={index}>
        <h4>Pool #{index + 1}</h4>
        <Field
          name={`pools[${index}].name`}
          fieldClassName={styles.poolField}
          component={TextInput.Field}
        />
        <Field
          label="Kapasitet"
          name={`pools[${index}].capacity`}
          type="number"
          fieldClassName={styles.poolField}
          component={TextInput.Field}
        />
        <Field
          label="Aktiveringstidspunkt"
          name={`pools[${index}].activationDate`}
          fieldClassName={styles.poolField}
          component={DatePicker.Field}
        />
        <Field
          label="Grupper med rettighet"
          name={`pools[${index}].permissionGroups`}
          fieldClassName={styles.poolField}
          component={SelectInput.Field}
          options={autocompleteResult}
          onSearch={query => groupQueryChanged(query)}
          fetching={searching}
          multi
        />
        <Button onClick={() => fields.remove(index)}>Remove pool</Button>
      </li>
    ))}
    <li>
      <Button
        onClick={() =>
          fields.push({
            name: '',
            registrations: [],
            activationDate: moment().toISOString(),
            permissionGroups: []
          })}
      >
        Add pool
      </Button>
    </li>
  </ul>
);

export default renderPools;
