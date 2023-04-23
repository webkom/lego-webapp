import { merge } from 'lodash';
import moment from 'moment-timezone';
import config from 'app/config';
import { EDITOR_EMPTY } from 'app/utils/constants';

type Validator<T = any, C = any> = (
  message?: string
) => (value: T, context?: C) => Readonly<[boolean, string]>;

export type ValidatorResult = { [field: string]: string[] };

export const EMAIL_REGEX = /.+@.+\..+/;
const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www[.])?(?:youtube[.]com\/watch[?]v=|youtu[.]be\/)([^&]{11})/;

export const required =
  (message = 'Feltet må fylles ut') =>
  (value) =>
    [!!value, message] as const;

export const legoEditorRequired =
  (message = 'Feltet må fylles ut') =>
  (value) =>
    [!!value && value !== EDITOR_EMPTY, message] as const;

export const maxLength =
  (length, message = `Kan ikke være lengre enn ${length} tegn`) =>
  (value) =>
    [!value || value.length < length, message] as const;

export const matchesRegex = (regex, message) => (value) =>
  [
    // Ignore empty values here, since we want to validate
    // that separately with e.g. required:
    !value || regex.test(value),
    message || `Not matching pattern ${regex.toString()}`,
  ] as const;

export const isEmail = (message = 'Ugyldig e-post') =>
  matchesRegex(EMAIL_REGEX, message);

export const validYoutubeUrl = (message = 'Ikke gyldig YouTube URL.') =>
  matchesRegex(YOUTUBE_URL_REGEX, message);

export const whenPresent =
  (validator: ReturnType<Validator>) => (value, context) =>
    value ? validator(value, context) : ([true] as const);

export const sameAs = (otherField, message) => (value, context) =>
  [value === context[otherField], message] as const;

export const timeIsAfter = (otherField, message) => (value, context) => {
  const startTime = moment.tz(context[otherField], config.timezone);
  const endTime = moment.tz(value, config.timezone);

  if (startTime > endTime) {
    return [false, message] as const;
  }

  return [true] as const;
};

export const isValidAllergy =
  (
    message = 'La feltet stå tomt hvis du ikke har noen allergier/preferanser'
  ) =>
  (value: string) => {
    const notValidAnswers = ['ingen', 'ingenting', 'nei', 'nope', 'nada'];

    return [!notValidAnswers.includes(value.toLowerCase()), message] as const;
  };

export const ifField =
  (field: string, validator: ReturnType<Validator>) => (value, context) =>
    context[field] ? validator(value, context) : ([true] as const);

export const ifNotField =
  (field: string, validator: ReturnType<Validator>) => (value, context) =>
    context[field] ? ([true] as const) : validator(value, context);

export function createValidator(
  fieldValidators: { [field: string]: ReturnType<Validator>[] },
  rawValidator?: (input) => ValidatorResult
) {
  return function validate(input) {
    const rawValidatorErrors: ValidatorResult = rawValidator?.(input) || {};
    const fieldValidatorErrors = Object.keys(fieldValidators).reduce(
      (errors: ValidatorResult, field) => {
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
