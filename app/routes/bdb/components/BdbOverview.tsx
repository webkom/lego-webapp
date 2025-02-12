import { LinkButton, Page } from '@webkom/lego-bricks';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLocation } from 'react-router-dom';
import { NavigationTab } from 'app/components/NavigationTab/NavigationTab';

const BdbOverview = () => {
  const isCompanyInterest = useLocation().pathname.includes('company-interest');

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
      <Outlet />
    </Page>
  );
};

export default BdbOverview;
