import React from 'react';
import { shallow } from 'enzyme';

import Markdown from './';

describe('<Markdown />', () => {
  it('should render markdown text', () => {
    const wrapper = shallow(
      <Markdown>
        **Hello World**
      </Markdown>
    );

    expect(wrapper.html()).toEqual(
      '<div><p><strong>Hello World</strong></p>\n</div>'
    );
  });

  it('should throw on invalid children', () => {
    expect(() => {
      shallow(
        <Markdown>
          {{ hello: 'world' }}
        </Markdown>
      );
    }).toThrow();
  });
});
