import { merge } from 'lodash';

export const EMAIL_REGEX = /.+@.+\..+/;
const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www[.])?(?:youtube[.]com\/watch[?]v=|youtu[.]be\/)([^&]{11})/;

export const required =
  (message = 'Feltet må fylles ut') =>
  (value) =>
    [!!value, message];

export const maxLength =
  (length, message = `Kan ikke være lengre enn ${length} tegn`) =>
  (value) =>
    [!value || value.length < length, message];

export const matchesRegex = (regex, message) => (value) =>
  [
    // Ignore empty values here, since we want to validate
    // that separately with e.g. required:
    !value || regex.test(value),
    message || `Not matching pattern ${regex.toString()}`,
  ];

export const isEmail = (message = 'Ugyldig e-post') =>
  matchesRegex(EMAIL_REGEX, message);

export const validYoutubeUrl = (message = 'Ikke gyldig YouTube URL.') =>
  matchesRegex(YOUTUBE_URL_REGEX, message);

export const whenPresent = (validator) => (value, context) =>
  value ? validator(value, context) : [true];

export const sameAs = (otherField, message) => (value, context) =>
  [value === context[otherField], message];

export function createValidator(fieldValidators, rawValidator) {
  return function validate(input) {
    const rawValidatorErrors = rawValidator ? rawValidator(input) : {};

    const fieldValidatorErrors = Object.keys(fieldValidators).reduce(
      (errors, field) => {
        const fieldErrors =
          fieldValidators[field]
            .map((validator) => validator(input[field], input))
            .filter(([isValid]) => !isValid)
            .map(([, message]) => message || 'not valid') || 0;
        if (fieldErrors.length) errors[field] = fieldErrors;
        return errors;
      },
      {}
    );
    return merge(fieldValidatorErrors, rawValidatorErrors);
  };
}
