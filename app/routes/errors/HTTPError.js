// @flow

import React, { Component } from 'react';
import { Container, Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  '400': '400 Bad Method',
  '401': '401 Unauthorized',
  '403': '403 Forbidden',
  '404': 'Webkom finner ikke det du leter etter!',
  '500': 'Noe gikk veldig galt, Webkom er på saken!'
};

const getHTTPError = statusCode => {
  const error = HTTPMapping[statusCode];
  return error ? error : HTTPMapping['404'];
};

type Props = {
  statusCode: number,
  location: any,
  setStatusCode: (statusCode: ?number) => void
};

export default class HTTPError extends Component<Props> {
  canvas: ?HTMLElement;

  componentDidMount() {
    const statusCode = this.props.statusCode
      ? this.props.statusCode.toString()
      : '404';
    renderAbakus(statusCode, this.canvas);
  }

  componentWillReceiveProps(nextProps: Props) {
    if (this.props.location !== nextProps.location) {
      this.props.setStatusCode(null);
    }
  }

  render() {
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
              ref={canvas => {
                this.canvas = canvas;
              }}
              style={{ width: '100%' }}
            />
          </Link>
          <h1 style={{ textAlign: 'center' }}>
            {getHTTPError(this.props.statusCode)}
          </h1>
        </Flex>
      </Container>
    );
  }
}
