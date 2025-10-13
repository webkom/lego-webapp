import { LinkButton, Page } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import { useAppSelector } from '~/redux/hooks';

const SurveysOverview = ({ children }: PropsWithChildren) => {
  const actionGrant = useAppSelector((state) => state.surveys.actionGrant);
  const isAdmin = actionGrant.includes('create');

  return (
    <Page
      title="Spørreundersøkelser"
      actionButtons={
        isAdmin && <LinkButton href="/surveys/new">Ny undersøkelse</LinkButton>
      }
      tabs={
        <>
          {isAdmin && (
            <>
              <NavigationTab href="/surveys">Administrer</NavigationTab>
              <NavigationTab href="/surveys/templates" matchSubpages>
                Maler
              </NavigationTab>
            </>
          )}
          <NavigationTab href="/surveys/mine">Mine svar</NavigationTab>
        </>
      }
    >
      {children}
    </Page>
  );
};

export default SurveysOverview;
