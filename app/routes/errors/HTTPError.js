import React, { Component } from 'react';
import { Content, Flex } from 'app/components/Layout';
import { Link } from 'react-router';
import renderAbakus from './renderAbakus';

const HTTPMapping = {
  400: '400 Bad Method',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: 'Webkom finner ikke det du leter etter!',
  500: 'Noe gikk veldig galt, Webkom er på saken!'
};
const getHTTPError = statusCode => {
  let error = HTTPMapping[statusCode];
  return error ? error : HTTPMapping[404];
};

class HTTPError extends Component {
  componentDidMount() {
    renderAbakus(this.props.statusCode.toString(), this.canvas);
  }

  render() {
    const { statusCode } = this.props;
    return (
      <Content>
        <Flex column alignItems="center" justifyContent="center">
          <Link to="/">
            <canvas
              id="canvas"
              ref={canvas => {
                this.canvas = canvas;
              }}
            />
          </Link>
          <h1>
            {getHTTPError(statusCode)}
          </h1>
        </Flex>
      </Content>
    );
  }
}
export default HTTPError;
