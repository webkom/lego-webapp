/* eslint-disable no-console */

import http from 'http';
import app from './server';

const server = http.createServer(app);

let currentApp = app;

app.listen(app.get('port'), app.get('host'), err => {
  if (err) {
    console.log(err);
  }

  console.log(`App is running on port ${app.get('port')}`);
});

if (module.hot) {
  module.hot.accept('./server', () => {
    server.removeListener('request', currentApp);
    server.on('request', app);
    currentApp = app;
  });
}
