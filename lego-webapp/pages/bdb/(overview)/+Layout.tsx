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
            href="/bdb/company-interest/create"
          >
            Ny bedriftsinteresse
          </LinkButton>
        ) : (
          <LinkButton key="new-company" href="/bdb/add">
            Ny bedrift
          </LinkButton>
        )
      }
      tabs={
        <>
          <NavigationTab href="/bdb">Semesterstatuser</NavigationTab>
          <NavigationTab href="/bdb/company-interest">
            Bedriftsinteresser
          </NavigationTab>
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
