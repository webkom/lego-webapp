import type { ValidatorResult } from 'app/utils/validation';

type AsyncValidator<T = any, C = any> = (
  message?: string
) => (value: T, context?: C) => Promise<Readonly<[boolean, string] | [true]>>;

type FieldValidators = {
  [field: string]: ReturnType<AsyncValidator>[];
};

const isValidatorMessage = (
  val: Readonly<[true] | [boolean, string]>
): val is Readonly<[boolean, string]> => {
  return val.length > 1;
};

const getValidationErrors = async <T, S>(
  validators: ReturnType<AsyncValidator>[],
  fieldData: T,
  formData: S
) => {
  const validationResults = await Promise.all(
    validators.map((validator) => validator(fieldData, formData))
  );
  return validationResults
    .filter(isValidatorMessage)
    .filter(([isValid]) => !isValid)
    .map(([, error]) => error);
};

const getFieldErrorArray = async <T>(
  fieldValidators: FieldValidators<T>,
  formData: T
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

/**
 * @deprecated
 * use createValidator (with async=true) instead
 */
export const createAsyncValidator = <T>(
  fieldValidators: FieldValidators<T>
) => {
  return async (formData: T) => {
    const fieldErrorArray = await getFieldErrorArray(fieldValidators, formData);

    if (fieldErrorArray.length) {
      throw fieldErrorArray.reduce(
        (errors: ValidatorResult, [field, fieldErrors]) => {
          errors[field] = fieldErrors;
          return errors;
        },
        {}
      );
    }
  };
};
