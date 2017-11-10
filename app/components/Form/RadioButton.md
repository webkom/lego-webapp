Basic radioButton:

```
const { Field } = require( 'redux-form');
const ReduxForm = require('ReduxFormExample').default;

<ReduxForm name="SelectInputform">
  <Field
    name="select"
    id="num1"
    inputValue="true"
    component={RadioButton.Field}
  />
  <Field
    name="select"
    id="num2"
    inputValue="false"
    component={RadioButton.Field}
  />
  <Field
    name="select"
    id="num3"
    inputValue="false"
    component={RadioButton.Field}
  />
</ReduxForm>
```
