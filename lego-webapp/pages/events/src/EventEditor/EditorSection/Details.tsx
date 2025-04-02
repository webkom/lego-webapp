import { Flex, Tooltip } from '@webkom/lego-bricks';
import { Field } from 'react-final-form';
import {
  RowSection,
  SelectInput,
  TextInput,
  CheckBox,
  DatePicker,
} from '~/components/Form';
import { Label } from '~/components/Form/Label';
import MazemapLink from '~/components/MazemapEmbed/MazemapLink';
import { EventTypeConfig } from '~/pages/events/utils';
import styles from '../EventEditor.module.css';
import type { EditingEvent } from '~/pages/events/utils';

type Props = {
  values: EditingEvent;
};

const Details: React.FC<Props> = ({ values }) => {
  return (
    <>
      <RowSection>
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
      </RowSection>
      <RowSection>
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
      </RowSection>
      <Flex className={styles.editorSectionRow}>
        <Field
          label="Dato"
          name="date"
          range
          component={DatePicker.Field}
          required
        />
      </Flex>
      <Flex className={styles.editorSectionRow}>
        <Flex column className={styles.editorSectionColumn}>
          <Label
            label="Sted"
            htmlFor="react-select-mazemapPoi-input"
            className={styles.label}
            required
          />
          <Field
            label="Bruk MazeMap"
            name="useMazemap"
            type="checkbox"
            component={CheckBox.Field}
          />
          {!values.useMazemap ? (
            <Field
              id="react-select-mazemapPoi-input"
              name="location"
              placeholder="Den Gode Nabo, Downtown, ..."
              component={TextInput.Field}
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
                    iconOnly
                    style={{ position: 'relative', top: '0.8rem' }}
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
      />
      <div>
        <Field
          label="Kun for spesifikk gruppe"
          description="Gjør arrangementet synlig for kun medlemmer i spesifikke grupper"
          name="isGroupOnly"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.isGroupOnly && (
          <div className={styles.subSection}>
            <Field
              name="canViewGroups"
              placeholder="Velg grupper"
              filter={['users.abakusgroup']}
              component={SelectInput.AutocompleteField}
              isMulti
            />
          </div>
        )}
      </div>
    </>
  );
};

export default Details;
