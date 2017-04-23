const EMAIL_REGEX = /.+@.+\..+/;

export const required = (message = 'Required') => value => [!!value, message];

export const matchesRegex = (regex, message) =>
  value => [
    regex.test(value),
    message || `Not matching pattern ${regex.toString()}`
  ];

export const isEmail = (message = 'Invalid Email') =>
  matchesRegex(EMAIL_REGEX, message);

export const whenPresent = validator =>
  (value, context) => value ? validator(value, context) : [true];

export const sameAs = (otherField, message) =>
  (value, context) => [value === context[otherField], message];

export function createValidator(fieldValidators) {
  return function validate(input) {
    return Object.keys(fieldValidators).reduce(
      (errors, field) => {
        const fieldErrors = fieldValidators[field]
          .map(validator => validator(input[field], input))
          .filter(([isValid]) => !isValid)
          .map(([, message]) => message || 'not valid') || 0;
        if (fieldErrors.length) errors[field] = fieldErrors;
        return errors;
      },
      {}
    );
  };
}
