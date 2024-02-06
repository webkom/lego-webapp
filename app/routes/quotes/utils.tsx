import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';

export const navigation = (title: string, actionGrant: Array<string>) => (
  <NavigationTab title={title}>
    <NavigationLink
      to="/quotes"
      additionalActivePaths={['/quotes?approved=true']}
    >
      Sitater
    </NavigationLink>
    {actionGrant.indexOf('approve') !== -1 && (
      <NavigationLink to="/quotes?approved=false">
        Ikke-godkjente sitater
      </NavigationLink>
    )}
    <NavigationLink to="/quotes/add">Legg til sitat</NavigationLink>
  </NavigationTab>
);
