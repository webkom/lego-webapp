import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import {
  TextInput,
  DatePicker,
  SelectInput,
  Button,
} from 'app/components/Form';
import styles from './EventEditor.css';
import type { Dateish, EventStatusType } from 'app/models';

type poolProps = {
  fields: Record<string, any>;
  startTime: Dateish;
  eventStatusType: EventStatusType;
};

const highWarning = (value) =>
  value && value >= 500
    ? 'Åpent arrangement gir uendelig plasser 😁'
    : undefined;

const renderPools = ({ fields, startTime, eventStatusType }: poolProps) => (
  <ul
    style={{
      flex: 1,
    }}
  >
    {fields.map((pool, index) => (
      <li key={index} className={styles.poolBox}>
        <h3 className={styles.poolHeader}>Pool #{index + 1}</h3>
        <Field
          label="Navn"
          name={`pools[${index}].name`}
          validate={(value) => {
            if (!value || value === '') {
              return 'Navn er påkrevd';
            }
            return undefined;
          }}
          fieldClassName={styles.metaField}
          className={styles.formField}
          component={TextInput.Field}
        />
        {['NORMAL'].includes(eventStatusType) && (
          <Field
            label="Kapasitet"
            name={`pools[${index}].capacity`}
            validate={(value) => {
              if (!value || isNaN(parseInt(value, 10))) {
                return 'Kapasitet er påkrevd og må være et tall';
              }
              if (Number(value) < 0) {
                return 'Kapasitet kan ikke være negativt';
              }
              if (Number(value) < 1) {
                return 'Pools må ha minst 1 plass';
              }
              return undefined;
            }}
            type="number"
            placeholder="20,30,50"
            warn={highWarning}
            fieldClassName={styles.metaField}
            className={styles.formField}
            component={TextInput.Field}
          />
        )}
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
          validate={(value) => {
            if (!value || value.length === 0) {
              return 'Rettighetsgruppe er påkrevd';
            }
            return undefined;
          }}
          fieldClassName={styles.metaField}
          filter={['users.abakusgroup']}
          component={SelectInput.AutocompleteField}
          isMulti
        />
        {['NORMAL'].includes(eventStatusType) && (
          <div className={styles.centeredButton}>
            <Button
              disabled={
                fields.value[index].registrations?.length > 0 ||
                fields.length === 1
              }
              onClick={() => fields.remove(index)}
            >
              Fjern pool
            </Button>
          </div>
        )}
      </li>
    ))}
    {['NORMAL'].includes(eventStatusType) && (
      <li>
        <div className={styles.centeredButton}>
          <Button
            onClick={() =>
              fields.push({
                name: `Pool #${fields.length + 1}`,
                registrations: [],
                activationDate: moment(startTime)
                  .subtract(7, 'd')
                  .hour(12)
                  .minute(0)
                  .toISOString(),
                permissionGroups: [],
              })
            }
          >
            Legg til ny pool
          </Button>
        </div>
      </li>
    )}
  </ul>
);

export default renderPools;
