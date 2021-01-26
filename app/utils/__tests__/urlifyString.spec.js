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
        ' ',
        <a key="https://vg.no" href="https://vg.no">
          https://vg.no
        </a>
      ]
    },
    {
      input: 'hs@abakus.no. And webkom@abakus.no, is cool',
      desc: 'not include comma or dot as mail postfix',
      expected: [
        <a key="hs@abakus.no" href="mailto:hs@abakus.no">
          hs@abakus.no
        </a>,
        '. And ',
        <a key="webkom@abakus.no" href="mailto:webkom@abakus.no">
          webkom@abakus.no
        </a>,
        ', is cool'
      ]
    },
    {
      input: 'https://abakus.no/abc/. https://vg.no/abc/, is cool',
      desc: 'not include comma or dot as url postfix',
      expected: [
        <a key="https://abakus.no/abc/" href="https://abakus.no/abc/">
          https://abakus.no/abc/
        </a>,
        '. ',
        <a key="https://vg.no/abc/" href="https://vg.no/abc/">
          https://vg.no/abc/
        </a>,
        ', is cool'
      ]
    },
    {
      input: 'Hei På deg',
      desc: 'text',
      expected: ['Hei På deg']
    },
    {
      input: 'abakus.no abakus2.no',
      desc: 'render urls with schema',
      expected: ['abakus.no abakus2.no']
    },
    {
      input: 'hs@abakus.no hs@abakus.no',
      desc: 'email ',
      expected: [
        <a key="hs@abakus.no" href="mailto:hs@abakus.no">
          hs@abakus.no
        </a>,
        ' ',
        <a key="hs@abakus.no" href="mailto:hs@abakus.no">
          hs@abakus.no
        </a>
      ]
    },
    {
      input:
        'Hei på Deg https://abakus.no/testing.-/ er kult, og webkom@abakus.no test',
      desc: 'nested strings, email-links and urls',
      expected: [
        'Hei på Deg ',
        <a
          key="https://abakus.no/testing.-/"
          href="https://abakus.no/testing.-/"
        >
          https://abakus.no/testing.-/
        </a>,
        ' er kult, og ',
        <a key="webkom@abakus.no" href="mailto:webkom@abakus.no">
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
