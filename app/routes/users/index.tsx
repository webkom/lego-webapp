import { Route, Routes } from 'react-router-dom-v5-compat';
import PageNotFound from '../pageNotFound';
import UserConfirmationForm from './components/UserConfirmation';
import UserProfile from './components/UserProfile';
import UserResetPasswordForm from './components/UserResetPassword';
import UserSettingsIndex from './components/UserSettingsIndex';

const UsersRoute = () => (
  <Routes>
    <Route path="registration" element={<UserConfirmationForm />} />
    <Route path="reset-password" element={<UserResetPasswordForm />} />
    <Route path=":username" element={<UserProfile />} />
    <Route path=":username/settings/*" element={<UserSettingsIndex />} />
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);

export default UsersRoute;
