import { Flex, Tooltip } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { TextInput, DatePicker, SelectInput, Button } from '~/components/Form';
import styles from './EventEditor.module.css';
import PoolSuggestion from './PoolSuggestions';
import type { Dateish, EventStatusType } from 'app/models';

type poolProps = {
  fields: Record<string, any>;
  startTime: Dateish;
  eventStatusType: EventStatusType;
};

const renderPools = ({ fields, startTime, eventStatusType }: poolProps) => (
  <ul
    style={{
      flex: 1,
    }}
  >
    {fields.map((pool, index) => {
      const registrationOpened = fields.value[index].registrations?.length > 0;

      return (
        <Flex
          column
          gap="var(--spacing-sm)"
          key={index}
          className={styles.poolBox}
        >
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
              component={TextInput.Field}
            />
          )}
          <Field
            label="Aktiveringstidspunkt"
            name={`pools[${index}].activationDate`}
            component={DatePicker.Field}
            disabled={registrationOpened}
          />
          <Tooltip
            className={styles.poolBox}
            content={
              registrationOpened
                ? 'Grupper kan ikke endres etter at påmelding har startet. For å legge til nye grupper, opprett en ny pool.'
                : undefined
            }
          >
            <Field
              disabled={registrationOpened}
              label="Grupper med rettighet"
              name={`pools[${index}].permissionGroups`}
              validate={(value) => {
                if (!value || value.length === 0) {
                  return 'Rettighetsgruppe er påkrevd';
                }
                return undefined;
              }}
              filter={['users.abakusgroup']}
              component={SelectInput.AutocompleteField}
              isMulti
              SuggestionComponent={
                registrationOpened ? undefined : PoolSuggestion
              }
            />
          </Tooltip>
          {['NORMAL'].includes(eventStatusType) && (
            <div className={styles.centeredButton}>
              <Button
                disabled={
                  fields.value[index].registrations?.length > 0 ||
                  fields.length === 1
                }
                onPress={() => fields.remove(index)}
              >
                Fjern pool
              </Button>
            </div>
          )}
        </Flex>
      );
    })}
    {['NORMAL'].includes(eventStatusType) && (
      <li>
        <div className={styles.addPoolButton}>
          <Button
            onPress={() =>
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
