import { Helmet } from 'react-helmet-async';
import { Route, Routes } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import NavigationLink from 'app/components/NavigationTab/NavigationLink';
import EmailListEditor from 'app/routes/admin/email/components/EmailListEditor';
import EmailLists from 'app/routes/admin/email/components/EmailLists';
import EmailUserEditor from 'app/routes/admin/email/components/EmailUserEditor';
import EmailUsers from 'app/routes/admin/email/components/EmailUsers';
import RestrictedMailEditor from 'app/routes/admin/email/components/RestrictedMailEditor';
import RestrictedMails from 'app/routes/admin/email/components/RestrictedMails';
import PageNotFound from 'app/routes/pageNotFound';

const EmailRoute = () => (
  <Content>
    <Helmet title="E-post" />
    <NavigationTab title="E-post">
      <NavigationLink to="/admin/email">Lister</NavigationLink>
      <NavigationLink to="/admin/email/users?enabled=true">
        Brukere
      </NavigationLink>
      <NavigationLink to="/admin/email/restricted">
        Begrenset e-post
      </NavigationLink>
    </NavigationTab>

    <Routes>
      <Route index element={<EmailLists />} />
      <Route path="lists/new`" element={<EmailListEditor />} />
      <Route path="lists/:emailListId" element={<EmailListEditor />} />
      <Route path="users" element={<EmailUsers />} />
      <Route path="users/new" element={<EmailUserEditor />} />
      <Route path="users/:emailUserId" element={<EmailUserEditor />} />
      <Route path="restricted" element={<RestrictedMails />} />
      <Route path="restricted/new" element={<RestrictedMailEditor />} />
      <Route
        path="restricted/:restrictedMailId"
        element={<RestrictedMailEditor />}
      />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  </Content>
);

export default EmailRoute;
