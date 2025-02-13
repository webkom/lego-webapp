import { LinkButton, Page } from '@webkom/lego-bricks';
import { Outlet } from 'react-router';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';

const SurveysOverview = () => {
  return (
    <Page
      title="Spørreundersøkelser"
      actionButtons={
        <LinkButton href="/surveys/add">Ny undersøkelse</LinkButton>
      }
      tabs={
        <>
          <NavigationTab href="/surveys">Undersøkelser</NavigationTab>
          <NavigationTab href="/surveys/templates" matchSubpages>
            Maler
          </NavigationTab>
        </>
      }
    >
      <Outlet />
    </Page>
  );
};

export default SurveysOverview;
