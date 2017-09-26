// @flow

import 'animate.css/animate.css';
import 'minireset.css/minireset.css';
import 'app/styles/globals.css';
import 'app/styles/icomoon.css';

import React from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';
import type { Store } from 'app/types';

type Props = {
  store: Store
};

const Root = (props: Props) => {
  const { store, ...restProps } = props;
  return (
    <Provider store={store}>
      <Router {...restProps} />
    </Provider>
  );
};

export default Root;
