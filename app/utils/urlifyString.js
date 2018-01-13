//@flow
import * as React from 'react';
import { isEmail, isURL } from 'validator';
import { compact } from 'lodash';

type Urlified = Array<React.Node | string>;

export const emailToLink = (mail: string): React.Node => (
  <a key={mail} href={`mailto:${mail}`}>
    {mail}
  </a>
);

export const urlToLink = (url: string): React.Node => (
  <a key={url} href={url}>
    {url}
  </a>
);

const urlifyString = (data: string): Urlified =>
  compact(
    data
      .split(' ')
      .reduce(
        (
          accumulator: Urlified,
          value: string,
          index: number,
          { length }: Array<string>
        ) => {
          const prevIndex = accumulator.length - 1;
          const postfix = index === length - 1 ? '' : ' ';
          if (isEmail(value)) {
            return accumulator.concat(emailToLink(value)).concat(postfix);
          }

          if (
            isURL(value, {
              require_protocol: true
            })
          ) {
            // Remove trailing dot or comma from url
            let lastChar = value[value.length - 1];
            if (lastChar === ',' || lastChar === '.') {
              value = value.slice(0, value.length - 1);
            } else {
              lastChar = '';
            }
            return accumulator
              .concat(urlToLink(value))
              .concat(lastChar + postfix);
          }
          const text = `${value}${postfix}`;

          if (prevIndex === -1) {
            return [text];
          }

          const prev = accumulator[prevIndex];
          if (typeof prev !== 'string') {
            return accumulator.concat(` ${text}`);
          }
          return accumulator.slice(0, prevIndex).concat(`${prev}${text}`);
        },
        []
      )
  );

export default urlifyString;
