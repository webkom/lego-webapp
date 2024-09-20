import { Flex } from '@webkom/lego-bricks';
import cx from 'classnames';
import { Field } from 'react-final-form';
import {
  SelectInput,
  TextInput,
  CheckBox,
  DatePicker,
} from 'app/components/Form';
import fieldStyles from 'app/components/Form/Field.css';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import Tooltip from 'app/components/Tooltip';
import { EventTypeConfig } from 'app/routes/events/utils';
import styles from '../EventEditor.css';
import type { EventEditorFormValues } from 'app/routes/events/components/EventEditor';

type Props = {
  values: EventEditorFormValues;
};

const Details = ({ values }: Props) => {
  return (
    <>
      <Flex className={styles.editorSectionRow}>
        <Field
          name="eventType"
          label="Type arrangement"
          fieldClassName={styles.metaField}
          component={SelectInput.Field}
          options={Object.entries(EventTypeConfig).map(([key, config]) => ({
            label: config.displayName,
            value: key,
          }))}
          placeholder="Arrangementstype"
          required
        />
        <Field
          name="company"
          label="Arrangerende bedrift"
          filter={['companies.company']}
          fieldClassName={styles.metaField}
          component={SelectInput.AutocompleteField}
          placeholder="Bedrift"
          isClearable
        />
      </Flex>
      <Flex className={styles.editorSectionRow}>
        <Field
          name="responsibleGroup"
          label="Ansvarlig gruppe"
          filter={['users.abakusgroup']}
          fieldClassName={styles.metaField}
          component={SelectInput.AutocompleteField}
          placeholder="Ansvar for arrangement"
          isClearable
        />
        <Field
          name="responsibleUsers"
          label="Ansvarlige brukere"
          filter={['users.user']}
          fieldClassName={styles.metaField}
          component={SelectInput.AutocompleteField}
          isMulti
          placeholder="Velg ansvarlige brukere"
          isClearable
        />
      </Flex>
      <Flex className={styles.editorSectionRow}>
        <Field
          label="Starter"
          name="startTime"
          component={DatePicker.Field}
          fieldClassName={styles.metaField}
          className={styles.formField}
          required
        />
        <Field
          label="Slutter"
          name="endTime"
          component={DatePicker.Field}
          fieldClassName={styles.metaField}
          className={styles.formField}
          required
        />
      </Flex>
      <Flex className={styles.editorSectionRow}>
        <Flex column className={styles.editorSectionColumn}>
          <Flex alignItems="center">
            <label
              htmlFor="react-select-mazemapPoi-input"
              className={styles.label}
            >
              Sted
            </label>
            <span className={fieldStyles.required}>*</span>
          </Flex>
          <Field
            label="Bruk MazeMap"
            name="useMazemap"
            type="checkbox"
            component={CheckBox.Field}
            fieldClassName={cx(styles.metaField, styles.mazemap)}
            className={styles.formField}
          />
          {!values.useMazemap ? (
            <Field
              id="react-select-mazemapPoi-input"
              name="location"
              placeholder="Den Gode Nabo, Downtown, ..."
              component={TextInput.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
            />
          ) : (
            <Flex alignItems="flex-start" gap="var(--spacing-sm)">
              <Field
                id="location"
                name="mazemapPoi"
                component={SelectInput.MazemapAutocomplete}
                fieldClassName={styles.metaField}
                placeholder="R1, Abakus, Kjel4 ..."
              />
              {values.mazemapPoi?.value && (
                <Tooltip content="Åpne stedet i MazeMap">
                  <MazemapLink
                    mazemapPoi={values.mazemapPoi?.value}
                    linkText="↗️"
                  />
                </Tooltip>
              )}
            </Flex>
          )}
        </Flex>
      </Flex>
      <Field
        label="Fremmedspråklig"
        description="Arrangementet er på et annet språk enn norsk (engelsk)"
        name="isForeignLanguage"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
      />
      <Field
        label="Kun for spesifikk gruppe"
        description="Gjør arrangementet synlig for kun medlemmer i spesifikke grupper"
        name="isGroupOnly"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
      />
      {values.isGroupOnly && (
        <div className={styles.subSection}>
          <Field
            name="canViewGroups"
            placeholder="Velg grupper"
            filter={['users.abakusgroup']}
            fieldClassName={styles.metaField}
            component={SelectInput.AutocompleteField}
            isMulti
          />
        </div>
      )}
    </>
  );
};

export default Details;
