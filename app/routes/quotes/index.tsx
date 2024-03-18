import loadable from '@loadable/component';
import PageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const QuotePage = loadable(() => import('./components/QuotePage'));
const AddQuote = loadable(() => import('./components/AddQuote'));

const QuotesRoute: RouteObject[] = [
  { index: true, Component: QuotePage },
  { path: 'add', Component: AddQuote },
  { path: ':quoteId', Component: QuotePage },
  { path: '*', children: PageNotFound },
];

export default QuotesRoute;
