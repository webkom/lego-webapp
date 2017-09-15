const EMAIL_REGEX = /.+@.+\..+/;
const PASSWORD_REGEX = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,72}$/;

export const required = (message = 'Feltet må fylles ut') => value => [
  !!value,
  message
];

export const matchesRegex = (regex, message) => value => [
  regex.test(value),
  message || `Not matching pattern ${regex.toString()}`
];

export const isEmail = (message = 'Ugyldig e-post') =>
  matchesRegex(EMAIL_REGEX, message);

export const validPassword = (
  message = 'Passordet må inneholde store og små bokstaver og tall'
) => matchesRegex(PASSWORD_REGEX, message);

export const whenPresent = validator => (value, context) =>
  value ? validator(value, context) : [true];

export const sameAs = (otherField, message) => (value, context) => [
  value === context[otherField],
  message
];

export function createValidator(fieldValidators) {
  return function validate(input) {
    return Object.keys(fieldValidators).reduce((errors, field) => {
      const fieldErrors =
        fieldValidators[field]
          .map(validator => validator(input[field], input))
          .filter(([isValid]) => !isValid)
          .map(([, message]) => message || 'not valid') || 0;
      if (fieldErrors.length) errors[field] = fieldErrors;
      return errors;
    }, {});
  };
}
