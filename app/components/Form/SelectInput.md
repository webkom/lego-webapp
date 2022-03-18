Example usage of `SelectInput` in redux form:

Note that SelectInput requires a unique name as string to be set to make
server-side-rendering work.

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

  <Field
    name="users"
    filter={['users.user']}
    placeholder="Autocomplete users"
    label="Autocomplete users"
    component={SelectInput.AutocompleteField}
    isMulti
  />

  <Field
    name="groups"
    filter={['users.abakusgroup']}
    placeholder="Autocomplete groups"
    label="Autocomplete groups"
    component={SelectInput.AutocompleteField}
    isMulti
  />

  <Field
    name="user"
    filter={['users.user']}
    placeholder="Autocomplete user"
    label="Autocomplete user"
    component={SelectInput.AutocompleteField}
  />
</ReduxForm>
```
