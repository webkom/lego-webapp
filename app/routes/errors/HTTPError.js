// @flow

import React, { Component } from 'react';
import { Container, Flex } from 'app/components/Layout';
import { Link } from 'react-router-dom';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  // Non-string literal property keys is not supported in flow yet
  // $FlowFixMe
  400: 'Noe gikk galt med forespørselen',
  // $FlowFixMe
  401: 'Du er ikke logget inn',
  // $FlowFixMe
  403: 'Denne siden har du ikke tilgang på',
  // $FlowFixMe
  404: 'Denne siden finnes ikke',
  // $FlowFixMe
  500: 'Noe gikk veldig galt, Webkom er på saken!',
};

const fallbackStatus = 404;

const getHTTPError = (statusCode) =>
  HTTPMapping[statusCode] || HTTPMapping[fallbackStatus];

type Props = {
  statusCode: number,
  location: any,
  setStatusCode?: (statusCode: ?number) => void,
};

export default class HTTPError extends Component<Props> {
  canvas: ?HTMLElement;

  componentDidMount() {
    const { statusCode = fallbackStatus } = this.props;
    renderAbakus(statusCode.toString(), this.canvas);
  }
  // eslint-disable-next-line
  componentWillReceiveProps(nextProps: Props) {
    const { setStatusCode, location } = this.props;
    const { location: nextLocation } = nextProps;

    if (setStatusCode && location !== nextLocation) {
      setStatusCode(null);
    }
  }

  shouldComponentUpdate() {
    return true;
  }

  render() {
    const { statusCode = fallbackStatus } = this.props;
    return (
      <Container>
        <Flex
          column
          alignItems="center"
          justifyContent="center"
          style={{ padding: '10px' }}
        >
          <Link to="/">
            <canvas
              id="canvas"
              ref={(canvas) => {
                this.canvas = canvas;
              }}
              style={{ width: '100%' }}
            />
          </Link>
          <h1 style={{ textAlign: 'center' }}>{getHTTPError(statusCode)}</h1>
        </Flex>
      </Container>
    );
  }
}
