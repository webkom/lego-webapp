//@flow
import urlifyString from '../urlifyString';
import * as React from 'react';

describe('UrlifyString', () => {
  const data: Array<{
    input: string,
    expected: Array<React.Node | string>,
    desc: string
  }> = [
    {
      input: 'https://abakus.no https://vg.no',
      desc: 'urls',
      expected: [
        <a key="https://abakus.no" href="https://abakus.no">
          https://abakus.no
        </a>,
        <a key="https://vg.no" href="https://vg.no">
          https://vg.no
        </a>
      ]
    },
    {
      input: 'Hei På deg',
      desc: 'text',
      expected: ['Hei På deg']
    },
    {
      input: 'mailto:hs@abakus.no',
      desc: 'mailto url ',
      expected: [
        <a key="mailto:hs@abakus.no" href="mailto:hs@abakus.no">
          hs@abakus.no
        </a>
      ]
    },
    {
      input:
        'Hei på Deg https://abakus.no er kult, og mailto:webkom@abakus.no test',
      desc: 'nested strings, mailto-links and urls',
      expected: [
        'Hei på Deg ',
        <a key="https://abakus.no" href="https://abakus.no">
          https://abakus.no
        </a>,
        ' er kult, og ',
        <a key="mailto:webkom@abakus.no" href="mailto:webkom@abakus.no">
          webkom@abakus.no
        </a>,
        ' test'
      ]
    }
  ];

  data.forEach(({ input, desc, expected }) => {
    it(`Should handle ${desc}`, () =>
      expect(urlifyString(input)).toEqual(expected));
  });
});
