import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { SelectInput, TextInput } from '~/components/Form';
import { type EditingEvent } from '~/pages/events/utils';
import {
  fetchAllLendableObjects,
  fetchAvailableLendableObjectIdsByDate,
} from '~/redux/actions/LendableObjectActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectAllLendableObjects,
  selectAvailableLendableObjectIds,
  selectLendableObjectsUnavailable,
  clearAvailableIds,
} from '~/redux/slices/lendableObjects';
import styles from '../EventEditor.module.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { FormatOptionLabelMeta, StylesConfig } from 'react-select';

type Props = {
  values: EditingEvent;
};

type LendingObjectOption = {
  label: string;
  value: EntityId;
  isAvailable: boolean;
};

const LendingSection: React.FC<Props> = ({ values }) => {
  const dispatch = useAppDispatch();
  const availableLendableObjectIds = useAppSelector(
    selectAvailableLendableObjectIds,
  );

  const lendingObjectsUnavailable = useAppSelector(
    selectLendableObjectsUnavailable,
  );

  usePreparedEffect(
    'fetchAllLendableObjects',
    () =>
      dispatch(fetchAllLendableObjects()).catch((err) => {
        // Log to aid debugging; slice will still mark fetch failure.
        // eslint-disable-next-line no-console
        console.error('fetchAllLendableObjects failed', err);
      }),
    [],
  );

  usePreparedEffect(
    'fetchAvailableLendableObjectIdsByDate',
    () => {
      // Debounce fetches to avoid rapid requests while the user edits dates.
      let timeout: ReturnType<typeof setTimeout> | null = null;

      if (!values.startTime || !values.endTime) {
        // Clear previously known availability when dates are cleared
        dispatch(clearAvailableIds());
        return;
      }

      timeout = setTimeout(() => {
        dispatch(
          fetchAvailableLendableObjectIdsByDate(
            values.startTime,
            values.endTime,
          ),
        ).catch((err) => {
          // eslint-disable-next-line no-console
          console.error('fetchAvailableLendableObjectIdsByDate failed', err);
        });
      }, 300);

      return () => {
        if (timeout) {
          clearTimeout(timeout);
        }
      };
    },
    [values.startTime, values.endTime],
  );

  const lendableObjects = useAppSelector(selectAllLendableObjects);
  const availableObjects = lendableObjects.filter((obj) => obj.canLend);
  const availableObjectIds = new Set(availableLendableObjectIds ?? []);
  const availabilityKnown = availableLendableObjectIds !== null;
  const lendingObjectOptions: LendingObjectOption[] = availableObjects.map(
    (obj) => ({
      label: obj.title,
      value: obj.id,
      isAvailable: !availabilityKnown || availableObjectIds.has(obj.id),
    }),
  );

  const lendingSelectStyle: StylesConfig<LendingObjectOption, true> = {
    option: (base, state) => ({
      ...base,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '0.75rem',
      color: state.data.isAvailable
        ? 'var(--lego-font-color)'
        : 'var(--placeholder-color)',
      fontWeight: state.data.isAvailable ? 500 : 400,
      opacity: state.data.isAvailable ? 1 : 0.65,
    }),
    menuPortal: (base) => ({
      ...base,
      zIndex: 100,
    }),
  };

  const formatLendingOptionLabel = (
    option: LendingObjectOption,
    { context }: FormatOptionLabelMeta<LendingObjectOption>,
  ) => {
    if (context === 'value' || option.isAvailable) {
      return option.label;
    }

    return (
      <div
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'space-between',
          gap: '0.75rem',
        }}
      >
        <span
          style={{
            textDecoration: option.isAvailable ? 'none' : 'line-through',
          }}
        >
          {option.label}
        </span>
        <span
          style={{
            fontSize: '12px',
            color: 'var(--placeholder-color)',
            textDecoration: 'none',
          }}
        >
          Ikke tilgjengelig i den valgte perioden
        </span>
      </div>
    );
  };

  if (lendingObjectsUnavailable) {
    return (
      <p className={styles.lendingUnavailable}>
        Det er ikke mulig å låne objekter i eventsystemet for øyeblikket.
      </p>
    );
  }

  return (
    <>
      <Field
        name="lendingObjects"
        label="Søk etter utlånsobjekt"
        fieldClassName={styles.metaField}
        component={SelectInput.Field}
        options={lendingObjectOptions}
        selectStyle={lendingSelectStyle}
        formatOptionLabel={formatLendingOptionLabel}
        isOptionDisabled={(option) => !option.isAvailable}
        placeholder="Utlånsobjekt"
        isMulti
        description="Dette gjør det mulig for arrangementet å låne objekter for et arrangmenet. Dette gjøres ved å lage en separat utlånsforespørsel etter at arrangementet er opprettet, i ditt navn. Objektene vil ikke være reservert før utlånsforespørselen er godkjent. Objektene vil heller ikke endres hvis arrangment endres på. Du er selv ansvarlig for å sjekke at objektene er tilgjengelige for utlån på det tidspunktet arrangementet skal være. "
      />

      {values.lendingObjects &&
        values.lendingObjects.length > 0 &&
        values.lendingObjects.map((obj, i) => (
          <Field
            key={obj.value || i}
            name={`lendingDescription.${i}`}
            label={`Kommentar til lån av ${obj.label}`}
            placeholder="Forklar hva dere skal bruke objektet til, og eventuelle andre detaljer."
            component={TextInput.Field}
          />
        ))}
    </>
  );
};

export default LendingSection;
