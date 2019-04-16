

import React from 'react';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const OverviewRoute = ({ children }: { children: any }) => (
  <div>{children}</div>
);

export default replaceUnlessLoggedIn(LoginPage)(OverviewRoute);
