import { LinkButton, Page } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageContext } from 'vike-react/usePageContext';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';

const BdbOverview = ({ children }: PropsWithChildren) => {
  const pageContext = usePageContext();
  const isCompanyInterest =
    pageContext.urlPathname.includes('company-interest');

  return (
    <Page
      title="Bedriftsdatabase"
      actionButtons={
        isCompanyInterest ? (
          <LinkButton
            key="new-company-interest"
            href="/bdb/company-interest/new"
          >
            Ny bedriftsinteresse
          </LinkButton>
        ) : (
          <LinkButton key="new-company" href="/bdb/new">
            Ny bedrift
          </LinkButton>
        )
      }
      tabs={
        <>
          <NavigationTab href="/bdb">Aktiv</NavigationTab>
          <NavigationTab href="/bdb/job-openings">Jobbannonser</NavigationTab>
          <NavigationTab href="/bdb/company-interest">
            Bedriftsinteresser
          </NavigationTab>
          <NavigationTab href="/bdb/archive">Arkiv</NavigationTab>
          <NavigationTab href="/bdb/statistics">Statistikk</NavigationTab>
        </>
      }
    >
      <Helmet
        title={isCompanyInterest ? 'Bedriftsinteresser' : 'Semesterstatuser'}
      />
      {children}
    </Page>
  );
};

export default BdbOverview;
