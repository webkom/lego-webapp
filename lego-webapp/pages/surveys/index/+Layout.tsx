import { LinkButton, Page, Icon } from '@webkom/lego-bricks';
import { Plus } from 'lucide-react';
import { PropsWithChildren } from 'react';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';

const SurveysOverview = ({ children }: PropsWithChildren) => {
  return (
    <Page
      title="Spørreundersøkelser"
      actionButtons={
        <LinkButton href="/surveys/new">
          <Icon iconNode={<Plus />} size={19} />
          Ny undersøkelse
        </LinkButton>
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
      {children}
    </Page>
  );
};

export default SurveysOverview;
