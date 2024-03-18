import loadable from '@loadable/component';
import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import AdminRoute from './admin';
import AnnouncementsRoute from './announcements';
import { AppRoute } from './app';
import ArticlesRoute from './articles';
import BdbRoute from './bdb';
import BrandRoute from './brand';
import CompaniesRoute from './company';
import CompanyInterestRoute from './companyInterest';
import ContactRoute from './contact';
import EventsRoute from './events';
import ForumRoute from './forum';
import InterestGroupsRoute from './interestgroups';
import JoblistingsRoute from './joblistings';
import MeetingsRoute from './meetings';
import PageNotFound from './pageNotFound';
import PagesRoute from './pages';
import PhotosRoute from './photos';
import PollsRoute from './polls';
import QuotesRoute from './quotes';
import SearchRoute from './search';
import SurveysRoute from './surveys';
import TagsRoute from './tags';
import TimelineRoute from './timeline';
import ValidatorRoute from './userValidator';
import UsersRoute from './users';

const CompanyInterestPage = loadable(
  () => import('./companyInterest/components/CompanyInterestPage'),
);
const Frontpage = loadable(() => import('./frontpage'));

export const RouterConfig: RouteObject[] = [
  {
    Component: AppRoute,
    children: [
      { index: true, Component: Frontpage },
      { path: 'admin/*', children: AdminRoute },
      { path: 'announcements/*', children: AnnouncementsRoute },
      { path: 'articles/*', children: ArticlesRoute },
      { path: 'bdb/*', children: BdbRoute },
      { path: 'brand/*', children: BrandRoute },
      { path: 'companies/*', children: CompaniesRoute },
      { path: 'register-interest', Component: CompanyInterestPage },
      { path: 'interesse', Component: CompanyInterestPage },
      { path: 'companyInterest/*', children: CompanyInterestRoute },
      { path: 'company-interest/*', children: CompanyInterestRoute },
      { path: 'contact', children: ContactRoute },
      { path: 'kontakt', children: ContactRoute },
      { path: 'events/*', children: EventsRoute },
      { path: 'forum/*', children: ForumRoute },
      { path: 'interest-groups/*', children: InterestGroupsRoute },
      { path: 'interestgroups/*', children: InterestGroupsRoute },
      { path: 'joblistings/*', children: JoblistingsRoute },
      { path: 'meetings/*', children: MeetingsRoute },
      { path: 'pages/*', children: PagesRoute },
      { path: 'photos/*', children: PhotosRoute },
      { path: 'polls/*', children: PollsRoute },
      { path: 'quotes/*', children: QuotesRoute },
      { path: 'search', children: SearchRoute },
      { path: 'surveys/*', children: SurveysRoute },
      { path: 'tags/*', children: TagsRoute },
      { path: 'timeline', children: TimelineRoute },
      { path: 'validator', children: ValidatorRoute },
      { path: 'users/*', children: UsersRoute },
      { path: '*', children: PageNotFound },
    ],
  },
];

let ClientRouter;
if (typeof window !== 'undefined') {
  ClientRouter = createBrowserRouter(RouterConfig);
}

export default ClientRouter;
