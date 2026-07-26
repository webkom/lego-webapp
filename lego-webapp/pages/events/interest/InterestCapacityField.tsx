import { Field } from 'react-final-form';
import { TextInput } from '~/components/Form';

// The one pool setting interest event creators control - the backend forces
// everything else about the pool (see INTEREST_EVENT_FORCED_FIELDS and
// force_interest_event_pools in lego). Shared between the dedicated interest
// editor and the generic event editor so the two cannot drift.
const InterestCapacityField = () => (
  <Field
    name="pools[0].capacity"
    label="Kapasitet"
    placeholder="0 = ubegrenset"
    description="Interessearrangementer er åpne for alle i Abakus fra de opprettes og frem til arrangementsstart"
    type="number"
    component={TextInput.Field}
  />
);

export default InterestCapacityField;
