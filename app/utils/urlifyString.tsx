import { compact } from 'lodash';
import * as React from 'react';
import { isEmail, isURL } from 'validator';

type Urlified = Array<React.ReactNode | string>;
export const emailToLink = (mail: string): React.ReactNode => (
  <a
    key={mail}
    href={`mailto:${mail}`}
    rel="noopener noreferrer"
    target="_blank"
  >
    {mail}
  </a>
);
export const urlToLink = (url: string): React.ReactNode => (
  <a key={url} href={url} rel="noopener noreferrer" target="_blank">
    {url}
  </a>
);

const urlifyString = (data: string): Urlified =>
  compact(
    data.split(/([ \t\n])/).reduce((accumulator: Urlified, value: string) => {
      // Remove trailing dot or comma from url
      let lastChar = value[value.length - 1];

      if (lastChar === ',' || lastChar === '.') {
        value = value.slice(0, value.length - 1);
      } else {
        lastChar = '';
      }

      const prevIndex = accumulator.length - 1;
      const postfix = lastChar;

      if (isEmail(value)) {
        return accumulator.concat(emailToLink(value)).concat(postfix);
      }

      if (
        isURL(value, {
          require_protocol: true,
        })
      ) {
        return accumulator.concat(urlToLink(value)).concat(postfix);
      }

      const text = `${value}${postfix}`;

      if (prevIndex === -1) {
        return [text];
      }

      const prev = accumulator[prevIndex];

      if (typeof prev !== 'string') {
        return accumulator.concat(text);
      }

      if (text === '\n') {
        return accumulator.concat(<br key={accumulator.length} />);
      }

      return accumulator.slice(0, prevIndex).concat(`${prev}${text}`);
    }, []),
  );

export default urlifyString;
