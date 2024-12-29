import { isEqual } from 'lodash';
import qs from 'qs';
import { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import type { ParsedQs } from 'qs';

/**
 * Parse query string and return default values if key is missing
 */
export const parseQueryString = <Values extends ParsedQs>(
  queryString: string,
  defaultValues: Values,
): Values => {
  const parsedQs = qs.parse(queryString, { ignoreQueryPrefix: true });

  // ensure that all array values are arrays
  for (const key in parsedQs) {
    const defaultValue = defaultValues[key];
    const parsedValue = parsedQs[key];
    if (Array.isArray(defaultValue) && typeof parsedValue === 'string') {
      parsedQs[key] = [parsedValue];
    }
  }

  return { ...defaultValues, ...parsedQs };
};

/**
 * Stringify query object and remove default values
 */
export const stringifyQuery = <Values extends ParsedQs>(
  query: Partial<Values>,
  defaultValues: Values,
): string => {
  const filteredQuery: ParsedQs = {};
  for (const key in query) {
    if (!isEqual(query[key], defaultValues[key])) {
      filteredQuery[key] = query[key];
    }
  }
  return qs.stringify(filteredQuery, {
    addQueryPrefix: true,
    encodeValuesOnly: true,
    arrayFormat: 'repeat',
  });
};

/**
 * Hook for fetching, parsing and updating query string
 */
const useQuery = <Values extends ParsedQs>(defaultValues: Values) => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = useMemo(
    () => parseQueryString(location.search, defaultValues),
    [location.search, defaultValues],
  );

  const setQuery = (query: Partial<Values>) => {
    navigate(
      {
        search: stringifyQuery(query, defaultValues),
      },
      { replace: true },
    );
  };

  const setQueryValue =
    <Key extends keyof Values>(key: Key) =>
    (value: Values[Key]) => {
      setQuery({
        ...query,
        [key]: value,
      });
    };

  const setQueryValues = (updates: Partial<Values>) => {
    setQuery({
      ...query,
      ...updates,
    });
  };

  return {
    query,
    setQuery,
    setQueryValue,
    setQueryValues,
  };
};

export default useQuery;
