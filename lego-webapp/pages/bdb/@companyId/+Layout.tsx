import { LinkButton, Page, Skeleton, PageCover } from '@webkom/lego-bricks';
import { PropsWithChildren } from 'react';
import { Helmet } from 'react-helmet-async';
import { usePageContext } from 'vike-react/usePageContext';
import { NavigationTab } from '~/components/NavigationTab/NavigationTab';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import {
  selectEventsForCompany,
  selectJoblistingsForCompany,
  selectTransformedAdminCompanyById,
} from '~/redux/slices/companies';
import { useParams } from '~/utils/useParams';
import { isEmpty } from 'lodash-es';

const CompanyLayout = ({ children }) => {
  const { companyId } = useParams<{ companyId: string }>();
  const company = useAppSelector((state) =>
    selectTransformedAdminCompanyById(state, companyId),
  );
  const fetchingCompany = useAppSelector((state) => state.companies.fetching);
  const showSkeleton = fetchingCompany && isEmpty(company);

  const title = `BDB: ${company.name}`;

  return (
    <Page
      back={{
        href: '/bdb',
      }}
      title={title}
      cover={
        <PageCover
          image={company?.logo}
          imagePlaceholder={company?.logoPlaceholder}
          skeleton={showSkeleton}
        />
      }
      tabs={
        <>
          <NavigationTab href={`/bdb/${companyId}`}>
            {' '}
            Bedriftsinformasjon{' '}
          </NavigationTab>
          <NavigationTab href={`/bdb/${companyId}/statistics`} matchSubpages>
            {' '}
            Statistikk{' '}
          </NavigationTab>
        </>
      }
    >
      {children}
    </Page>
  );
};
export default CompanyLayout;
