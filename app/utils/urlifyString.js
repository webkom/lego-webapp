//@flow
import * as React from 'react';

type Urlified = Array<React.Node | string>;

export const isUrl = (data: string) =>
  data.match(
    /^(https?:\/\/|mailto:)?([\da-z.-@]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/
  );

export const urlToLink = (url: string): React.Node => (
  <a key={url} href={url}>
    {url.replace('mailto:', '')}
  </a>
);

const urlifyString = (data: string): Urlified =>
  data
    .split(' ')
    .reduce(
      (
        accumulator: Urlified,
        value: string,
        index: number,
        { length }: Array<string>
      ) => {
        if (isUrl(value)) {
          return accumulator.concat(urlToLink(value));
        }
        const prevIndex = accumulator.length - 1;
        const postfix = index === length - 1 ? '' : ' ';
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
    );

export default urlifyString;
