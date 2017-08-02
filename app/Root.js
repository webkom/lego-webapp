// @flow

import 'animate.css/animate.css';
import 'minireset.css/minireset.css';
import 'app/styles/globals.css';
import 'app/styles/icomoon.css';

import React, { Component } from 'react';
import { Router } from 'react-router';
import { Provider } from 'react-redux';

type Props = {
  store: Object
};

const Root = (props: Props) => {
  const { store, ...props } = props;
  return (
    <Provider {...{ store }}>
      <Router {...props} />
    </Provider>
  );
};

export default Root;
