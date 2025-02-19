import { createLogger } from 'redux-logger';

const loggerMiddleware = createLogger({
  level: 'info',
  collapsed: true,
});

export default loggerMiddleware;
