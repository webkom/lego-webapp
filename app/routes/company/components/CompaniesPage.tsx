import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
  Image,
  Page,
  LinkButton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import { fetchAll } from 'app/actions/CompanyActions';
import { selectActiveCompanies } from 'app/reducers/companies';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import utilities from 'app/styles/utilities.css';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import styles from './CompaniesPage.css';
import type { ListCompany } from 'app/store/models/Company';

const CompanyItem = ({ company }: { company: ListCompany }) => {
  return (
    <Link to={`/companies/${company.id}`}>
      <Card isHoverable hideOverflow className={styles.companyItem}>
        <div className={styles.companyItemContent}>
          <div className={styles.companyLogoContainer}>
            <div className={styles.companyLogo}>
              <Image
                src={company.logo ?? ''}
                placeholder={company.logoPlaceholder}
                alt={`${company.name} logo`}
              />
            </div>
          </div>
          <Flex
            justifyContent="center"
            alignItems="center"
            gap="3rem"
            className={styles.companyInfo}
          >
            <Flex
              column
              alignItems="center"
              className={
                company.joblistingCount && company.joblistingCount > 0
                  ? styles.interestingCount
                  : undefined
              }
            >
              <Icon name="briefcase" size={20} />
              <span>{company.joblistingCount}</span>
            </Flex>
            <Flex
              column
              alignItems="center"
              className={
                company.eventCount && company.eventCount > 0
                  ? styles.interestingCount
                  : undefined
              }
            >
              <Icon name="calendar-clear" size={20} />
              <span>{company.eventCount}</span>
            </Flex>
          </Flex>
        </div>
      </Card>
    </Link>
  );
};

type CompanyListProps = {
  companies: ListCompany[];
};

const CompanyList = ({ companies = [] }: CompanyListProps) => (
  <div className={styles.companyList}>
    {companies.map((company, id) => (
      <CompanyItem key={id} company={company} />
    ))}
  </div>
);

const CompaniesPage = () => {
  const [expanded, setExpanded] = useState(false);

  const companies = useAppSelector(selectActiveCompanies<ListCompany>);
  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      query: {},
      entity: 'companies',
      endpoint: '/companies/',
    })(state),
  );

  const dispatch = useAppDispatch();

  const actionGrant = useAppSelector((state) => state.companies.actionGrant);

  usePreparedEffect(
    'fetchAllCompanies',
    () => dispatch(fetchAll({ fetchMore: false })),
    [],
  );

  return (
    <Page
      title="Bedrifter"
      actionButtons={
        (actionGrant.includes('create') || actionGrant.includes('edit')) && (
          <LinkButton href="/bdb">Bedriftsdatabasen</LinkButton>
        )
      }
    >
      <Helmet title="Bedrifter" />

      <div>
        <p className={styles.infoText}>
          Vil du jobbe som in-house utvikler i din drømmebedrift? Ser du for deg
          en hverdag som konsulent på oppdrag hos de kuleste kundene? Er
          sikkerhet din greie, eller drømmer du om å drive med spillutvikling på
          heltid? På denne siden har vi samlet et utvalg potensielle
          arbeidsgivere for deg som student, som gjenspeiler mangfoldet du har i
          jobbmuligheter.
        </p>
        {!expanded && (
          <Button
            flat
            className={styles.readMore}
            onPress={() => setExpanded(true)}
          >
            Vis mer
          </Button>
        )}
        <div className={!expanded ? utilities.hiddenOnMobile : undefined}>
          <p className={styles.infoText}>
            Trykk deg inn på en bedrift for å se hva slags type bedrift det er,
            les mer om hva de jobber med og se hvor de holder til. Bla deg
            gjennom en oversikt over tidligere eller kommende arrangementer og
            se hvem som har jobbannonser ute for øyeblikket. Hvis du vil lese
            mer om bedriften så kan du navigere deg til nettsiden deres via
            linken.
          </p>

          <p className={styles.infoText}>
            Savner du en bedrift? Savner du noe informasjon om en bedrift? Ta
            kontakt med Bedkom, vi tar gjerne imot innspill!
          </p>
          <Button
            flat
            className={styles.readMore}
            onPress={() => setExpanded(false)}
          >
            Vis mindre
          </Button>
        </div>
      </div>

      <Flex wrap justifyContent="center" className={styles.iconInfoPlacement}>
        <Flex gap="var(--spacing-sm)">
          <Icon name="briefcase" />
          <span>Aktive jobbannonser</span>
        </Flex>
        <Flex gap="var(--spacing-sm)">
          <Icon name="calendar-clear" />
          <span>Kommende arrangementer</span>
        </Flex>
      </Flex>

      <InfiniteScroll
        element="div"
        hasMore={pagination.hasMore}
        loadMore={() =>
          pagination.hasMore &&
          !pagination.fetching &&
          dispatch(fetchAll({ fetchMore: true }))
        }
        initialLoad={false}
        loader={<LoadingIndicator loading />}
      >
        <CompanyList companies={companies} />
      </InfiniteScroll>
    </Page>
  );
};

export default guardLogin(CompaniesPage);
