import loadable from '@loadable/component';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const QuotePage = loadable(() => import('./components/QuotePage'));
const AddQuote = loadable(() => import('./components/AddQuote'));

const quotesRoute: RouteObject[] = [
  { index: true, Component: QuotePage },
  { path: 'add', Component: AddQuote },
  { path: ':quoteId', Component: QuotePage },
  { path: '*', children: pageNotFound },
];

export default quotesRoute;
