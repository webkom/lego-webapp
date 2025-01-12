import { merge } from 'lodash-es';
import moment from 'moment-timezone';
import config from 'app/config';
import { EDITOR_EMPTY } from 'app/utils/constants';
import type { ValidationErrors } from 'final-form';

type Validator<T = any, C = any> = (
  message?: string,
) => (value: T, context?: C) => Readonly<[false, string] | [true, string?]>;

type AsyncValidator<T = any, C = any> = (
  message?: string,
) => (value: T, context?: C) => Promise<Readonly<[boolean, string] | [true]>>;

export type ValidatorResult = ValidationErrors;

export const EMAIL_REGEX = /.+@.+\..+/;
const YOUTUBE_URL_REGEX =
  /(?:https?:\/\/)?(?:www[.])?(?:youtube[.]com\/watch[?]v=|youtu[.]be\/)([^&]{11})/;

export const required =
  (message = 'Feltet må fylles ut') =>
  (value: unknown) => {
    if (Array.isArray(value)) {
      if (value.length === 0) {
        // List of values must have at least one value
        return [false, message] as const;
      } else if (value.some((v) => 'checked' in v)) {
        // Checkbox array must have at least one checked
        const atLeastOneTrue = value.some((v) => v.checked);
        return [atLeastOneTrue, message] as const;
      }
    }
    return [!!value, message] as const;
  };

export const requiredIf =
  (conditionalFn, message = `Feltet må fylles ut`) =>
  (value, allValues) => {
    return [conditionalFn(allValues) ? !!value : true, message] as const;
  };

export const conditionalValidation = (conditionalFn, validationFnGenerator) => {
  return (value, allValues) => {
    if (conditionalFn(allValues)) {
      const validators = validationFnGenerator();
      for (const validator of validators) {
        const [isValid, message] = validator(value, allValues);
        if (!isValid) {
          return [false, message] as const;
        }
      }
    }
    return [true] as const;
  };
};

export const atLeastOneFieldRequired =
  (fieldNames: string[], message = 'Du må fylle ut minst ett felt') =>
  (_, allValues) => {
    const hasAtLeastOneValue = fieldNames.some((fieldName) => {
      const value = allValues[fieldName];
      return Boolean(value && (Array.isArray(value) ? value.length : true));
    });
    return [hasAtLeastOneValue, message] as const;
  };

export const legoEditorRequired =
  (message = 'Feltet må fylles ut') =>
  (value) =>
    [!!value && value !== EDITOR_EMPTY, message] as const;

export const maxLength =
  (length, message = `Kan ikke være lengre enn ${length} tegn`) =>
  (value) =>
    [!value || value.length < length, message] as const;

export const maxSize =
  (size, message = `Må være mindre enn ${size}`) =>
  (value) =>
    [!value || value < size, message] as const;

export const minSize =
  (size, message = `Må være mer enn ${size}`) =>
  (value) =>
    [!value || value > size, message] as const;

export const isInteger =
  (message = 'Verdi må være heltall') =>
  (value) =>
    [!value || /^-?\d+$/.test(value), message] as const;

export const matchesRegex = (regex, message) => (value) =>
  [
    // Ignore empty values here, since we want to validate
    // that separately with e.g. required:
    !value || regex.test(value),
    message || `Not matching pattern ${regex.toString()}`,
  ] as const;

export const isEmail = (message = 'Ugyldig e-post') =>
  matchesRegex(EMAIL_REGEX, message);

export const isNotAbakusEmail =
  (message = 'Kan ikke være Abakus-e-post') =>
  (value) =>
    [!value || !value.endsWith('@abakus.no'), message] as const;

export const validYoutubeUrl = (message = 'Ugyldig YouTube-URL') =>
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

export const timeIsAtLeastDurationAfter =
  (otherField, duration, message) => (value, allValues) => {
    const firstTime = moment(allValues[otherField]);
    const secondTime = moment(value);

    if (!firstTime.isValid() || !secondTime.isValid()) {
      return [true] as const;
    }

    const minimumSecondTime = firstTime.clone().add(duration);
    if (secondTime.isAfter(minimumSecondTime)) {
      return [true] as const;
    }

    return [false, message] as const;
  };

export const mergeTimeAfterAllPoolsActivation =
  (message) => (mergeTime, allValues) => {
    if (!mergeTime || !allValues.pools || allValues.pools.length === 0) {
      return [true] as const; // No validation if mergeTime or pools are not set
    }

    const isAfterAll = allValues.pools.every((pool) => {
      const activationTime = moment(pool.activationDate);
      return (
        !activationTime.isValid() || moment(mergeTime).isAfter(activationTime)
      );
    });

    return [isAfterAll, message] as const;
  };

export const isValidAllergy: Validator<string | undefined> =
  (
    message = 'La feltet stå tomt hvis du ikke har noen allergier/preferanser',
  ) =>
  (value) => {
    if (!value) return [true] as const;
    const notValidAnswers = [
      'ingen',
      'ingenting',
      'nei',
      'no',
      'nope',
      'none',
      'n/a',
      'null',
      'nada',
      'indøk',
      'matte 4',
    ];

    return [!notValidAnswers.includes(value.toLowerCase()), message] as const;
  };

export const isValidGithubUsername =
  (message = 'Ikke et gyldig GitHub-brukernavn') =>
  (value: string) => {
    const validRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;

    return [validRegex.test(value), message] as const;
  };

export const isValidLinkedinId =
  (message = 'Ikke en gyldig LinkedIn-ID') =>
  (value: string) => {
    const validRegex = /^[a-zA-Z0-9-]{0,70}$/i;

    return [validRegex.test(value), message] as const;
  };

export const ifField =
  (field: string, validator: ReturnType<Validator>) => (value, context) =>
    context[field] ? validator(value, context) : ([true] as const);

export const ifNotField =
  (field: string, validator: ReturnType<Validator>) => (value, context) =>
    context[field] ? ([true] as const) : validator(value, context);

export function createValidator(
  fieldValidators: {
    [field: string]: (ReturnType<Validator> | ReturnType<AsyncValidator>)[];
  },
  rawValidator?: (input) => ValidatorResult,
  async = false,
) {
  if (async) {
    return async function validate(input) {
      const rawValidatorErrors: ValidatorResult = rawValidator?.(input) || {};

      // Run validators on each field
      const fieldValidationResults = {};
      for (const field of Object.keys(fieldValidators)) {
        const validationResult = await Promise.all(
          fieldValidators[field].map(async (validator) => {
            let result = validator(input[field], input);
            if (result instanceof Promise) {
              result = await result;
            }
            return result;
          }),
        );

        fieldValidationResults[field] = validationResult;
      }

      // Extract errors from each validation
      const fieldValidationErrors = {};
      for (const field of Object.keys(fieldValidators)) {
        const validationErrors =
          fieldValidationResults[field]
            ?.filter(([isValid]) => !isValid)
            .map(([, message]) => message || 'not valid') ?? [];

        if (validationErrors.length)
          fieldValidationErrors[field] = validationErrors;
      }

      return merge(fieldValidationErrors, rawValidatorErrors);
    };
  }

  return function validate(input) {
    const rawValidatorErrors: ValidatorResult = rawValidator?.(input) || {};
    const fieldValidatorErrors = Object.keys(fieldValidators).reduce(
      (errors: ValidatorResult, field) => {
        const fieldErrors =
          fieldValidators[field]
            ?.map((validator) => validator(input[field], input))
            .filter(([isValid]) => !isValid)
            .map(([, message]) => message || 'not valid') ?? [];
        if (fieldErrors.length) errors[field] = fieldErrors;
        return errors;
      },
      {},
    );
    return merge(fieldValidatorErrors, rawValidatorErrors);
  };
}

/* Used for DatePicker (supports both single date and range) */
export const dateRequired =
  (message = 'Du må velge dato') =>
  (value) => {
    if (!value) return [false, message] as const;

    if (Array.isArray(value)) {
      // Range validation
      return [value.length === 2 && value[0] && value[1], message] as const;
    }

    // Single date validation
    return [!!value, message] as const;
  };

/* Used for DatePicker (supports both single date and range) */
export const datesAreInCorrectOrder =
  (message = 'Sluttidspunkt kan ikke være før starttidspunkt') =>
  (value) => {
    const firstDate = moment(value[0]);
    const secondDate = moment(value[1]);

    if (firstDate.isAfter(secondDate)) {
      return [false, message] as const;
    }

    return [true] as const;
  };
