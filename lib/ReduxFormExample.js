/* eslint-disable */

const { Provider } = require('react-redux');
const configureStore = require('app/utils/configureStore').default;
const React = require('react');
const { reduxForm } = require('redux-form');

const initialState = {
  app: {
    name: 'Pizza Delivery',
  },
};

const store = configureStore(initialState, {});

const MyForm = ({ handleSubmit, children }) => (
  <form onSubmit={handleSubmit}>{children}</form>
);

const MyReduxForm = reduxForm({
  form: 'myForm',
})(MyForm);

//export default MyReduxForm;
const Form = (data) => (
  <Provider store={store}>
    <div>
      <MyReduxForm>{data.children}</MyReduxForm>
    </div>
  </Provider>
);

export default Form;
