import React from 'react';
import { Content } from 'app/components/Layout';

const HTTPMapping = {
  400: '400 Bad Method',
  401: '401 Unauthorized',
  403: '403 Forbidden',
  404: '404 Not Found'
};
const getHTTPError = statusCode => {
  let error = HTTPMapping[statusCode];
  return error ? error : HTTPMapping[404];
};

const HTTPError = ({ statusCode }) =>
  <Content>
    <h1>
      {getHTTPError(statusCode)}
    </h1>
  </Content>;

export default HTTPError;
