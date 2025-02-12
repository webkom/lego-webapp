import { lazyComponent } from 'app/utils/lazyComponent';
import pageNotFound from '../pageNotFound';
import type { RouteObject } from 'react-router-dom';

const QuotePage = lazyComponent(() => import('./components/QuotePage'));
const AddQuote = lazyComponent(() => import('./components/AddQuote'));

const quotesRoute: RouteObject[] = [
  { index: true, lazy: QuotePage },
  { path: 'add', lazy: AddQuote },
  { path: ':quoteId', lazy: QuotePage },
  { path: '*', children: pageNotFound },
];

export default quotesRoute;
