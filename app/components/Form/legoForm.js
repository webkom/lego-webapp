// @flow

import { reduxForm } from 'redux-form';

const legoForm = (config: Object) =>
  reduxForm({
    ...config,
    onSubmitFail: errors => {
      const [firstErrorField] = Object.keys(errors);

      const field = document.querySelector(`[name="${firstErrorField}"]`);
      if (field && field.focus) {
        field.focus();
      }
      config.onSubmitFail && config.onSubmitFail(errors);
    }
  });

export default legoForm;
