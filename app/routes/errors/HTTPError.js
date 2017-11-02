// @flow

import React, { Component } from 'react';
import { Container, Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  '400': 'Noe gikk galt med forespørselen',
  '401': 'Du er ikke logget inn',
  '403': 'Denne siden har du ikke tilgang på',
  '404': 'Denne siden finnes ikke. Er du logget inn?',
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
