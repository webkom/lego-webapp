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
  fields: Object
};

const renderPools = ({ fields }: poolProps) => (
  <ul style={{ flex: 1 }}>
    {fields.map((pool, index) => (
      <li key={index}>
        <h4>Pool #{index + 1}</h4>
        <Field
          name={`pools[${index}].name`}
          fieldClassName={styles.metaField}
          className={styles.formField}
          component={TextInput.Field}
        />
        <Field
          label="Kapasitet"
          name={`pools[${index}].capacity`}
          type="number"
          placeholder="0 er ubegrenset"
          fieldClassName={styles.metaField}
          className={styles.formField}
          component={TextInput.Field}
        />
        <Field
          label="Aktiveringstidspunkt"
          name={`pools[${index}].activationDate`}
          fieldClassName={styles.metaField}
          className={styles.formField}
          component={DatePicker.Field}
        />
        <Field
          label="Grupper med rettighet"
          name={`pools[${index}].permissionGroups`}
          fieldClassName={styles.metaField}
          filter={['users.abakusgroup']}
          component={SelectInput.AutocompleteField}
          multi
        />
        <Button
          disabled={fields.get(index).registrations.length > 0}
          onClick={() => fields.remove(index)}
        >
          Fjern pool
        </Button>
      </li>
    ))}
    <li>
      <Button
        onClick={() =>
          fields.push({
            name: `Pool #${fields.length + 1}`,
            registrations: [],
            activationDate: moment().toISOString(),
            permissionGroups: []
          })}
      >
        Legg til pool
      </Button>
    </li>
  </ul>
);

export const validatePools = pools => {
  const capacity = pools.reduce((a, b) => a + b.capacity, 0);
  const errors = pools.map((pool, i) => {
    const poolError = {};
    if (!pool.name) {
      poolError.name = 'Navn påkrevet';
    }
    if (isNaN(parseInt(pool.capacity, 10))) {
      poolError.capacity = 'Kapasitet påkrevet';
    }
    if (Number(pool.capacity) === 0 && (capacity > 0 || pools.length > 1)) {
      poolError.capacity = 'En ubegrenset pool kan kun eksistere alene';
    }
    if (pool.permissionGroups.length === 0) {
      poolError.permissionGroups = 'Rettighetsgruppe er påkrevet';
    }
    return poolError;
  });
  return errors;
};
export default renderPools;
