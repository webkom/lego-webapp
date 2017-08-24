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
import AutocompleteField from 'app/components/Search/AutocompleteField';

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
}: poolProps) =>
  <ul>
    {fields.map((pool, index) =>
      <li key={index}>
        <h4>
          Pool #{index + 1}
        </h4>
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
        <AutocompleteField
          label="Grupper med rettighet"
          name={`pools[${index}].permissionGroups`}
          fieldClassName={styles.poolField}
          filter={['users.abakusgroup']}
          component={SelectInput.Field}
          multi
        />
        <Button
          disabled={fields.get(index).registrations.length > 0}
          onClick={() => fields.remove(index)}
        >
          Fjern pool
        </Button>
      </li>
    )}
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
        Legg til pool
      </Button>
    </li>
  </ul>;

export default renderPools;
