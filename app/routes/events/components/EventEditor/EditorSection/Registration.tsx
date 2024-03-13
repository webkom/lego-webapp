import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  SelectInput,
  TextInput,
  CheckBox,
  DatePicker,
} from 'app/components/Form';
import { FormatTime } from 'app/components/Time';
import { AttendanceStatus } from 'app/components/UserAttendance';
import AttendanceModal from 'app/components/UserAttendance/AttendanceModal';
import {
  containsAllergier,
  eventStatusTypes,
  tooLow,
} from 'app/routes/events/utils';
import { spyValues } from 'app/utils/formSpyUtils';
import styles from '../EventEditor.css';
import renderPools from '../renderPools';
import type { EditingEvent } from 'app/routes/events/utils';

type Props = {
  values: EditingEvent;
};

const Registrations: React.FC<Props> = ({ values }) => {
  const initialPool = {
    name: 'Pool #1',
    registrations: [],
    activationDate: moment(values.startTime)
      .subtract(7, 'd')
      .hour(12)
      .minute(0)
      .toISOString(),
    permissionGroups: [],
  };

  return (
    <>
      {spyValues((values: EditingEvent) => {
        // Adding an initial pool if the event status type allows for it and there are no current pools
        if (['NORMAL', 'INFINITE'].includes(values.eventStatusType?.value)) {
          if (values.pools.length === 0) {
            values.pools = [initialPool];
          }
        } else {
          // Removing all pools so that they are not validated on submit
          if (values.pools.length > 0) {
            values.pools = [];
          }
        }

        return (
          <Field
            label="Påmeldingstype"
            name="eventStatusType"
            component={SelectInput.Field}
            fieldClassName={styles.metaField}
            options={eventStatusTypes}
            required
          />
        );
      })}

      {['NORMAL', 'INFINITE'].includes(values.eventStatusType?.value) && (
        <NormalOrInfiniteStatusType values={values} />
      )}
    </>
  );
};

export default Registrations;

type NormalOrInfiniteStatusTypeProps = Props;

const NormalOrInfiniteStatusType: React.FC<NormalOrInfiniteStatusTypeProps> = ({
  values,
}) => {
  return (
    <>
      <Field
        label="Betalt arrangement"
        name="isPriced"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
        parse={(v) => !!v}
      />
      {values.isPriced && (
        <div className={styles.subSection}>
          <Field
            label="Betaling via Abakus.no"
            description="Manuell betaling kan også godkjennes av oss i etterkant"
            name="useStripe"
            type="checkbox"
            component={CheckBox.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
            parse={(v) => !!v}
          />
          <Flex className={styles.editorSectionRow}>
            <Field
              label="Pris"
              name="priceMember"
              type="number"
              component={TextInput.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
              warn={tooLow}
              required
            />
            <Field
              label="Betalingsfrist"
              name="paymentDueDate"
              component={DatePicker.Field}
              fieldClassName={styles.metaField}
              className={styles.formField}
            />
          </Flex>
        </div>
      )}
      <Field
        label="Bruk prikker"
        name="heedPenalties"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
        parse={(v) => !!v}
      />
      {values.heedPenalties && (
        <div className={styles.subSection}>
          <Field
            key="unregistrationDeadline"
            label="Avregistreringsfrist"
            description="Frist for avmelding - fører til prikk etterpå"
            name="unregistrationDeadline"
            component={DatePicker.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
          />
        </div>
      )}
      <Flex className={styles.editorSectionRow}>
        <Flex column className={styles.editorSectionColumn}>
          <Field
            key="registrationDeadlineHours"
            label="Registrering antall timer før"
            description="Frist for påmelding/avmelding - antall timer før arrangementet. Det er ikke mulig å melde seg hverken på eller av etter denne fristen (negativ verdi betyr antall timer etter starten på arrangementet)"
            name="registrationDeadlineHours"
            type="number"
            component={TextInput.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
          />
          <p className={styles.registrationDeadlineHours}>
            Stenger <FormatTime time={moment(values.registrationDeadline)} />
          </p>
        </Flex>
        <Flex column className={styles.editorSectionColumn}>
          <Field
            label="Separat avregistreringsfrist"
            description="Separate frister for påmelding og avmelding - antall timer før arrangementet. Det vil ikke være mulig å melde seg av eller på etter de satte fristene (negativ verdi betyr antall timer etter starten på arrangementet)"
            name="separateDeadlines"
            type="checkbox"
            component={CheckBox.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
            parse={(v) => !!v}
          />
          {values.separateDeadlines && (
            <div className={styles.subSection}>
              <Field
                key="unregistrationDeadlineHours"
                label="Avregistrering antall timer før"
                description="Frist for avmelding antall timer før arrangementet (negativ verdi betyr antall timer etter starten på arrangementet)"
                name="unregistrationDeadlineHours"
                type="number"
                component={TextInput.Field}
                fieldClassName={styles.metaField}
                className={styles.formField}
              />
            </div>
          )}
        </Flex>
      </Flex>
      <Field
        label="Samtykke til bilder"
        description="Bruk samtykke til bilder"
        name="useConsent"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
        parse={(v) => !!v}
      />
      <Field
        label="Påmeldingsspørsmål"
        description="Still et spørsmål ved påmelding"
        name="hasFeedbackQuestion"
        type="checkbox"
        component={CheckBox.Field}
        fieldClassName={styles.metaField}
        className={styles.formField}
        parse={(v) => !!v}
      />
      {values.hasFeedbackQuestion && (
        <div className={styles.subSection}>
          <Field
            name="feedbackDescription"
            placeholder="Burger eller sushi?"
            component={TextInput.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
            warn={containsAllergier}
          />
          <Field
            name="feedbackRequired"
            label="Obligatorisk"
            type="checkbox"
            component={CheckBox.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
            parse={(v) => !!v}
          />
        </div>
      )}
      <Flex column>
        <h3>Pools</h3>
        <AttendanceModal
          key="modal"
          pools={values.pools || []}
          title="Påmeldte"
        >
          {({ toggleModal }) => (
            <AttendanceStatus toggleModal={toggleModal} pools={values.pools} />
          )}
        </AttendanceModal>
        <div className={styles.metaList}>
          <FieldArray
            name="pools"
            component={renderPools}
            startTime={values.startTime}
            eventStatusType={values.eventStatusType?.value}
          />
        </div>
        {values.pools?.length > 1 && (
          <Field
            label="Sammenslåingstidspunkt"
            description="Tidspunkt for å slå sammen poolene"
            name="mergeTime"
            component={DatePicker.Field}
            fieldClassName={styles.metaField}
            className={styles.formField}
          />
        )}
      </Flex>
    </>
  );
};
