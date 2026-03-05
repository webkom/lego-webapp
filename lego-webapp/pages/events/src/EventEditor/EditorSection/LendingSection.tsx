import { usePreparedEffect } from '@webkom/react-prepare';
import { Field } from 'react-final-form';
import { SelectInput, TextInput } from '~/components/Form';
import { type EditingEvent } from '~/pages/events/utils';
import { fetchAllLendableObjects } from '~/redux/actions/LendableObjectActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectAllLendableObjects } from '~/redux/slices/lendableObjects';
import styles from '../EventEditor.module.css';

type Props = {
  values: EditingEvent;
};

const LendingSection: React.FC<Props> = ({ values }) => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchAllLendableObjects',
    () => dispatch(fetchAllLendableObjects()),
    [],
  );

  const lendableObjects = useAppSelector(selectAllLendableObjects);
  const availableObjects = lendableObjects.filter((obj) => obj.canLend);

  return (
    <>
      <Field
        name="lendingObjects"
        label="Søk etter utlånsobjekt"
        fieldClassName={styles.metaField}
        component={SelectInput.Field}
        options={availableObjects.map((obj) => ({
          label: obj.title,
          value: obj.id,
        }))}
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
