

import React from 'react';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

export const navigation = (title: string, actionGrant: Array<string>) => (
  <NavigationTab title={title}>
    <NavigationLink to="/quotes/?filter=all">Sitater</NavigationLink>
    {actionGrant.indexOf('approve') !== -1 && (
      <NavigationLink to="/quotes?filter=unapproved">
        Ikke godkjente sitater
      </NavigationLink>
    )}
    <NavigationLink to="/quotes/add">Legg til sitat</NavigationLink>
  </NavigationTab>
);
