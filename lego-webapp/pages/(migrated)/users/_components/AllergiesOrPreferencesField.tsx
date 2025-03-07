import { Field } from 'react-final-form';
import { TextInput } from '~/components/Form';

const AllergiesOrPreferencesField = () => (
  <Field
    name="allergies"
    label="Matallergier eller preferanser"
    description="Dette brukes kun på arrangementer for å kartlegge bestilling av mat, og vil ikke vises offentlig"
    placeholder="F.eks. laktoseintoleranse, nøtteallergi ..."
    component={TextInput.Field}
  />
);

export default AllergiesOrPreferencesField;
