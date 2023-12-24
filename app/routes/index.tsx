import loadable from '@loadable/component';
import { Route, Routes } from 'react-router-dom-v5-compat';
import { AppRoute } from './app';

const AdminRoute = loadable(() => import('./admin'));
const AnnouncementsRoute = loadable(() => import('./announcements'));
const ArticlesRoute = loadable(() => import('./articles'));
const BdbRoute = loadable(() => import('./bdb'));
const BrandRoute = loadable(() => import('./brand'));
const CompaniesRoute = loadable(() => import('./company'));
const CompanyInterestPage = loadable(
  () => import('./companyInterest/components/CompanyInterestPage')
);
const CompanyInterestRoute = loadable(() => import('./companyInterest'));
const ContactRoute = loadable(() => import('./contact'));
const EventsRoute = loadable(() => import('./events'));
const InterestGroupsRoute = loadable(() => import('./interestgroups'));
const JoblistingsRoute = loadable(() => import('./joblistings'));
const MeetingsRoute = loadable(() => import('./meetings'));
const Overview = loadable(() => import('./overview'));
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
const UserValidatorRoute = loadable(() => import('./userValidator'));

const RouterConfig = () => (
  <AppRoute>
    <Routes>
      <Route index element={<Overview />} />
      <Route path="admin/*" element={<AdminRoute />} />
      <Route path="announcements/*" element={<AnnouncementsRoute />} />
      <Route path="articles/*" element={<ArticlesRoute />} />
      <Route path="bdb/*" element={<BdbRoute />} />
      <Route path="brand/*" element={<BrandRoute />} />
      <Route path="companies/*" element={<CompaniesRoute />} />
      <Route path="register-interest" element={<CompanyInterestPage />} />
      <Route path="interesse" element={<CompanyInterestPage />} />
      <Route path="companyInterest/*" element={<CompanyInterestRoute />} />
      <Route path="contact" element={<ContactRoute />} />
      <Route path="kontakt" element={<ContactRoute />} />
      <Route path="events/*" element={<EventsRoute />} />
      <Route path="interest-groups/*" element={<InterestGroupsRoute />} />
      <Route path="interestgroups/*" element={<InterestGroupsRoute />} />
      <Route path="joblistings/*" element={<JoblistingsRoute />} />
      <Route path="meetings/*" element={<MeetingsRoute />} />
      <Route path="pages/*" element={<PagesRoute />} />
      <Route path="photos/*" element={<PhotosRoute />} />
      <Route path="polls/*" element={<PollsRoute />} />
      <Route path="quotes/*" element={<QuotesRoute />} />
      <Route path="search" element={<SearchRoute />} />
      <Route path="surveys/*" element={<SurveysRoute />} />
      <Route path="tags/*" element={<TagsRoute />} />
      <Route path="timeline" element={<TimelineRoute />} />
      <Route path="users/*" element={<UsersRoute />} />
      <Route path="validator" element={<UserValidatorRoute />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </AppRoute>
);

export default RouterConfig;
