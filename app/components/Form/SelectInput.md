Example usage of `SelectInput` in redux form:

```
const { Field } = require( 'redux-form');
const ReduxForm = require('ReduxFormExample').default;

const options = [
  { value: 0, label: 'This' },
  { value: 1, label: 'Is' },
  { value: 2, label: 'A' },
  { value: 3, label: 'Nice' },
  { value: 4, label: 'Field' }
];

<ReduxForm name="SelectInputform">
  <Field
  name="select"
  component={SelectInput.Field}
  placeholder="Select stuff"
  options={options}
  />
</ReduxForm>
```
