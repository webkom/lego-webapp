Example usage of `SelectInput` in redux form:


    const { Provider } = require('react-redux');
    const configureStore = require('app/utils/configureStore').default;
    const initialState = {
      app: {
        name: 'Pizza Delivery'
      }
    };
    const store = configureStore({ initialState });
    const options = [{ value: 0, label: 'Ingen' },{ value: 2, label: 'Test' }];
    const React = require( 'react');
    const { Field, reduxForm } = require( 'redux-form');

    const MyForm = ({handleSubmit}) => (
          <form onSubmit={handleSubmit}>

          <Field
            name="select"
            component={SelectInput.Field}
            placeholder="Select stuff"
            options={options}
          />
          </form>
        );

    MyReduxForm = reduxForm({
      form: 'myForm'
    })(MyForm);
    <Provider store={store}>
      <MyReduxForm onSubmit={()=>{}} />
    </Provider>
