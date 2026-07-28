import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import {
  SelectInput,
  TextInput,
  CheckBox,
  DatePicker,
  RowSection,
} from '~/components/Form';
import { FormatTime } from '~/components/Time';
import Attendance from '~/components/UserAttendance/Attendance';
import {
  containsAllergier,
  eventStatusTypes,
  registrationEditingCloseTime,
  tooLow,
  unregistrationEditingCloseTime,
} from '~/pages/events/utils';
import { spyValues } from '~/utils/formSpyUtils';
import styles from '../EventEditor.module.css';
import renderPools from '../renderPools';
import type { EditingEvent } from '~/pages/events/utils';

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
      <div>
        <Field
          label="Betalt arrangement"
          name="isPriced"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.isPriced && (
          <Flex column gap="var(--spacing-sm)" className={styles.subSection}>
            <Field
              label="Betaling via Abakus.no"
              description="Manuell betaling kan også godkjennes i påmeldingsoversikt i etterkant"
              name="useStripe"
              type="checkbox"
              component={CheckBox.Field}
            />
            <RowSection>
              <Field
                label="Pris"
                name="priceMember"
                type="number"
                component={TextInput.Field}
                warn={tooLow}
                required
              />
              <Field
                label="Betalingsfrist"
                name="paymentDueDate"
                component={DatePicker.Field}
              />
            </RowSection>
          </Flex>
        )}
      </div>
      <div>
        <Field
          label="Bruk prikker"
          name="heedPenalties"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.heedPenalties && (
          <div className={styles.subSection}>
            <Field
              key="unregistrationDeadline"
              label="Frist for prikk"
              description="Avmelding etter denne fristen vil gi prikk"
              name="unregistrationDeadline"
              component={DatePicker.Field}
            />
          </div>
        )}
      </div>
      <div>
        <Field
          key="registrationDeadlineHours"
          label="Påmeldingsfrist (timer før arrangementsstart)"
          description="Etter denne fristen er det ikke mulig å melde seg på. Gjelder også avmelding, med mindre separat avregistreringsfrist er valgt. Negativ verdi gir frist etter arrangementstart."
          name="registrationDeadlineHours"
          type="number"
          component={TextInput.Field}
        />
        <span className={styles.registrationDeadlineHours}>
          {`${values.separateDeadlines ? 'Påmelding stenger' : 'Påmelding og avmelding stenger'} `}
          <FormatTime time={registrationEditingCloseTime(values)} />
        </span>
      </div>
      <div>
        <Field
          label="Separat avmeldingsfrist"
          description="Velg om du vil ha en separat frist for avmelding"
          name="separateDeadlines"
          type="checkbox"
          component={CheckBox.Field}
        />
        {values.separateDeadlines && (
          <div className={styles.subSection}>
            <Field
              key="unregistrationDeadlineHours"
              label="Avmeldingsfrist (timer før arrangementsstart)"
              description="Etter denne fristen er det ikke mulig å melde seg av. Negativ verdi gir frist etter arrangementstart."
              name="unregistrationDeadlineHours"
              type="number"
              component={TextInput.Field}
            />
            <span className={styles.unregistrationDeadlineHours}>
              Avmelding stenger{' '}
              <FormatTime time={unregistrationEditingCloseTime(values)} />
            </span>
          </div>
        )}
      </div>
      <Field
        label="Samtykke til bilder"
        description="Bruk samtykke til bilder"
        name="useConsent"
        type="checkbox"
        component={CheckBox.Field}
      />
      <Field
        label="Påmeldingsspørsmål"
        description="Still et spørsmål ved påmelding"
        name="hasFeedbackQuestion"
        type="checkbox"
        component={CheckBox.Field}
      />
      {values.hasFeedbackQuestion && (
        <div className={styles.subSection}>
          <Field
            name="feedbackDescription"
            placeholder="Burger eller sushi?"
            component={TextInput.Field}
            warn={containsAllergier}
          />
          <Field
            name="feedbackRequired"
            label="Obligatorisk"
            type="checkbox"
            component={CheckBox.Field}
          />
        </div>
      )}
      <div>
        <h3>Pools</h3>
        <Attendance pools={values.pools} showUserGrid={false} />
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
          />
        )}
      </div>
    </>
  );
};
