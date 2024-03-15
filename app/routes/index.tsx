import loadable from '@loadable/component';
import { type RouteObject, createBrowserRouter } from 'react-router-dom';
import AdminRoute from './admin';
import AnnouncementsRoute from './announcements';
import { AppRoute } from './app';
import ArticlesRoute from './articles';
import BdbRoute from './bdb';
import BrandRoute from './brand';

const CompaniesRoute = loadable(() => import('./company'));
const CompanyInterestPage = loadable(
  () => import('./companyInterest/components/CompanyInterestPage'),
);
const CompanyInterestRoute = loadable(() => import('./companyInterest'));
const ContactRoute = loadable(() => import('./contact'));
const EventsRoute = loadable(() => import('./events'));
const InterestGroupsRoute = loadable(() => import('./interestgroups'));
const JoblistingsRoute = loadable(() => import('./joblistings'));
const MeetingsRoute = loadable(() => import('./meetings'));
const Frontpage = loadable(() => import('./frontpage'));
const PageNotFound = loadable(() => import('./pageNotFound'));
const PagesRoute = loadable(() => import('./pages'));
const PhotosRoute = loadable(() => import('./photos'));
const PollsRoute = loadable(() => import('./polls'));
const QuotesRoute = loadable(() => import('./quotes'));
const SearchRoute = loadable(() => import('./search'));
const SurveysRoute = loadable(() => import('./surveys'));
const TagsRoute = loadable(() => import('./tags'));
const TimelineRoute = loadable(() => import('./timeline'));
const UsersRoute = loadable(() => import('./users'));
const ForumRoute = loadable(() => import('./forum'));
const UserValidatorRoute = loadable(() => import('./userValidator'));

export const RouterConfig: RouteObject[] = [
  {
    path: '*',
    Component: AppRoute,
    children: [
      { index: true, Component: Frontpage },
      { path: 'admin/*', children: AdminRoute },
      { path: 'announcements/*', children: AnnouncementsRoute },
      { path: 'articles/*', children: ArticlesRoute },
      { path: 'bdb/*', children: BdbRoute },
      { path: 'brand/*', children: BrandRoute },
      { path: 'companies/*', Component: CompaniesRoute },
      { path: 'register-interest', Component: CompanyInterestPage },
      { path: 'interesse', Component: CompanyInterestPage },
      { path: 'companyInterest/*', Component: CompanyInterestRoute },
      { path: 'contact', Component: ContactRoute },
      { path: 'kontakt', Component: ContactRoute },
      { path: 'events/*', Component: EventsRoute },
      { path: 'forum/*', Component: ForumRoute },
      { path: 'interest-groups/*', Component: InterestGroupsRoute },
      { path: 'interestgroups/*', Component: InterestGroupsRoute },
      { path: 'joblistings/*', Component: JoblistingsRoute },
      { path: 'meetings/*', Component: MeetingsRoute },
      { path: 'pages/*', Component: PagesRoute },
      { path: 'photos/*', Component: PhotosRoute },
      { path: 'polls/*', Component: PollsRoute },
      { path: 'quotes/*', Component: QuotesRoute },
      { path: 'search', Component: SearchRoute },
      { path: 'surveys/*', Component: SurveysRoute },
      { path: 'tags/*', Component: TagsRoute },
      { path: 'timeline', Component: TimelineRoute },
      { path: 'users/*', Component: UsersRoute },
      { path: 'validator', Component: UserValidatorRoute },
      { path: '*', Component: PageNotFound },
    ],
  },
];

let ClientRouter;
if (typeof window !== 'undefined') {
  ClientRouter = createBrowserRouter(RouterConfig);
}

export default ClientRouter;
