import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
  Image,
  Page,
  LinkButton,
  filterSidebar,
  FilterSection,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { CheckBox, TextInput } from '~/components/Form';
import { fetchAll } from '~/redux/actions/CompanyActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import { selectAllPaginatedCompanies } from '~/redux/slices/companies';
import { selectPaginationNext } from '~/redux/slices/selectors';
import useQuery from '~/utils/useQuery';
import styles from './CompaniesPage.module.css';
import type { ListCompany } from '~/redux/models/Company';

const CompanyItem = ({ company }: { company: ListCompany }) => {
  return (
    <a href={`/companies/${company.id}`}>
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
    </a>
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

export const companiesDefaultQuery = {
  search: '',
  showInactive: 'false' as 'true' | 'false',
};

const CompaniesPage = () => {
  const [expanded, setExpanded] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const { query, setQueryValue } = useQuery(companiesDefaultQuery);

  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      query: { ...query, search: debouncedSearch },
      entity: EntityType.Companies,
      endpoint: '/companies/',
    })(state),
  );

  const companies = useAppSelector((state) =>
    selectAllPaginatedCompanies<ListCompany>(state, { pagination }),
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(query.search);
    }, 300);

    return () => clearTimeout(timer);
  }, [query.search]);

  const dispatch = useAppDispatch();
  const actionGrant = useAppSelector((state) => state.companies.actionGrant);

  usePreparedEffect(
    'fetchAllCompanies',
    () =>
      dispatch(
        fetchAll({
          fetchMore: false,
          query: { ...query, search: debouncedSearch },
        }),
      ),
    [query.showInactive, debouncedSearch],
  );

  return (
    <Page
      title="Bedrifter"
      sidebar={filterSidebar({
        children: (
          <>
            <FilterSection title="Søk">
              <TextInput
                type="text"
                prefix="search"
                placeholder="Søk etter bedrifter ..."
                value={query.search}
                onChange={(e) => setQueryValue('search')(e.target.value)}
              />
            </FilterSection>
            <CheckBox
              id="showInactive"
              label="Vis inaktive bedrifter"
              checked={query.showInactive === 'true'}
              onChange={() =>
                setQueryValue('showInactive')(
                  query.showInactive === 'true' ? 'false' : 'true',
                )
              }
            />
          </>
        ),
      })}
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
        {expanded && (
          <div>
            <p className={styles.infoText}>
              Trykk deg inn på en bedrift for å se hva slags type bedrift det
              er, les mer om hva de jobber med og se hvor de holder til. Bla deg
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
        )}
      </div>

      <Flex wrap justifyContent="center" className={styles.iconInfoPlacement}>
        <Flex alignItems="center" gap="var(--spacing-sm)">
          <Icon name="briefcase" />
          <span>Aktive jobbannonser</span>
        </Flex>
        <Flex alignItems="center" gap="var(--spacing-sm)">
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
          dispatch(
            fetchAll({
              fetchMore: true,
              query: { ...query, search: debouncedSearch },
            }),
          )
        }
        initialLoad={false}
        loader={<LoadingIndicator loading />}
      >
        <CompanyList companies={companies} />
      </InfiniteScroll>
    </Page>
  );
};

export default CompaniesPage;
