import React, { Component } from 'react';
import { connect } from 'react-redux';

type FormOptions = {
  getInitialState: (props: Object) => Object,
  validate: (values: Object) => Object,
  onSubmit: (values: Object) => Promise<*>
};

function formatServerErrors(error) {
  if (error.response && error.response.jsonData) {
    return error.response.jsonData;
  }

  return {};
}

/**
 * A higher-order component for creating simple forms.
 *
 * `getInitialValues` is assumed to set values for ALL the fields
 * in the form.
 *
 * Usage
 * ```js
 * createFormContainer({
 *   validate: createValidator({
 *     name: [required()]
 *   }),
 *   getInitialValues(props) {
 *     return {
 *       name: props.name
 *     };
 *   },
 *   onSubmit: createUser // redux action
 * })(MyEditorComponent);
 * ```
*/

function createFormContainer(formOptions: FormOptions) {
  return FormComponent => {
    class FormContainer extends Component {
      props: {
        dispatch: () => void
      };

      state = {
        values: formOptions.getInitialValues(this.props),
        touched: {},
        errors: {},
        saving: false
      };

      unmounted = false;

      componentWillUnmount() {
        this.unmounted = true;
      }

      handleSubmit = e => {
        e.preventDefault();

        const { validate, onSubmit } = formOptions;

        const errors = validate(this.state.values);

        if (Object.keys(errors).length > 0) {
          this.setState({ errors });
          return;
        }

        this.setState({ saving: true });
        onSubmit(this.state, this.props).then(
          () => !this.unmounted && this.setState({ saving: false }),
          action =>
            !this.unmounted &&
            this.setState({
              saving: false,
              errors: formatServerErrors(action.payload)
            })
        );
      };

      handleChange = e => {
        const field = e.target.name;
        const value = e.target.value;

        this.setState(prevState => ({
          values: {
            ...prevState.values,
            [field]: value
          }
        }));
      };

      handleBlur = e => {
        const field = e.target.name;
        const errors = formOptions.validate(this.state.values);
        this.setState(prevState => ({
          errors,
          touched: {
            ...prevState.touched,
            [field]: true
          }
        }));
      };

      getFieldProps = () => {
        return Object.entries(this.state.values).reduce(
          (fields, [field, value]) => {
            fields[field] = {
              value,
              name: field,
              placeholder: field,
              onChange: this.handleChange,
              onBlur: this.handleBlur,
              meta: {
                touched: !!this.state.touched[field],
                error: this.state.errors[field]
              }
            };

            return fields;
          },
          {}
        );
      };

      render() {
        return (
          <FormComponent
            handleSubmit={this.handleSubmit}
            fields={this.getFieldProps()}
            errors={this.state.errors}
            saving={this.state.saving}
            isValid={
              Object.keys(this.state.touched).length > 0 &&
                Object.keys(this.state.errors).length === 0
            }
          />
        );
      }
    }

    return connect()(FormContainer);
  };
}

export default createFormContainer;
