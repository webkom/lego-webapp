// @flow

export type AsyncFieldValidator<T = any> = (
  fieldValue: T,
  formData: Object
) => Promise<[true] | [boolean, string]>;

type FieldValidators = {|
  [field: string]: AsyncFieldValidator<>[],
|};

const getValidationErrors = async (
  validators: AsyncFieldValidator<>[],
  fieldData: any,
  formData: Object
): Promise<string[]> => {
  const validationResults = await Promise.all(
    validators.map((validator) => validator(fieldData, formData))
  );

  return (
    validationResults
      .filter(([isValid]) => !isValid)
      // $FlowFixMe flow doesn't understand that the filter ensures that error message exists
      .map(([, error]) => error)
  );
};

const getFieldErrorArray = async (
  fieldValidators: FieldValidators,
  formData: Object
): Promise<[string, string[]][]> => {
  return (
    await Promise.all(
      Object.keys(fieldValidators).map(
        async (field): Promise<[string, string[]]> => [
          field,
          await getValidationErrors(
            fieldValidators[field],
            formData[field],
            formData
          ),
        ]
      )
    )
  ).filter(([, fieldErrors]) => fieldErrors.length);
};

export const createAsyncValidator = (fieldValidators: FieldValidators) => {
  return async (formData: Object) => {
    const fieldErrorArray = await getFieldErrorArray(fieldValidators, formData);

    if (fieldErrorArray.length) {
      throw fieldErrorArray.reduce((errors, [field, fieldErrors]) => {
        errors[field] = fieldErrors;
        return errors;
      }, {});
    }
  };
};
