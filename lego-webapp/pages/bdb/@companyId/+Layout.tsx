import { LinkButton, Page } from '@webkom/lego-bricks';
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

const CompanyLayout = ({ children }) =>{
    const { companyId } = useParams<{ companyId: string }>();
    const company = useAppSelector((state) =>
        selectTransformedAdminCompanyById(state, companyId),
      );
    const title = `BDB: ${company.name}`;

    return (
        <Page
            title = {title}

            tabs = { 
                <>
                    <NavigationTab href={`/bdb/${companyId}`}> Bedriftsinformasjon </NavigationTab>
                    <NavigationTab href={`/bdb/${companyId}/statistics`} matchSubpages> Statistikk </NavigationTab>
                </>
            }
        >
            
            { children }
        </Page>
    )
};
export default CompanyLayout;

/*
    const pageContext = usePageContext();
    const isCompanyInterest = pageContext.urlPathname.includes('company-interest');
    const { companyId } = useParams<{ companyId: string }>();

    return (
        <Page
            cover={
                <PageCover
                image={company?.logo}
                imagePlaceholder={company?.logoPlaceholder}
                skeleton={showSkeleton}
                />
            }

            tabs={ 
                <>
                <NavigationTab href={`/bdb/${companyId}`}> Bedriftsinformasjon </NavigationTab>
                <NavigationTab href={`/bdb/${companyId}/statistics`} matchSubpages> Statistikk </NavigationTab>
                </>
            }

        ></Page>
    );
*/