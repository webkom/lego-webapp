import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
} from '@webkom/lego-bricks';
import cx from 'classnames';
import { useState, useRef, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom-v5-compat';
import { fetchAll } from 'app/actions/CompanyActions';
import { Image } from 'app/components/Image';
import { LoginPage } from 'app/components/LoginForm';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectActiveCompanies } from 'app/reducers/companies';
import { selectPaginationNext } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { ListCompany } from 'app/store/models/Company';
import utilities from 'app/styles/utilities.css';
import styles from './CompaniesPage.css';

const CompanyItem = ({ company }: { company: ListCompany }) => {
  return (
    <Link to={`/companies/${company.id}`}>
      <Card isHoverable hideOverflow className={styles.companyItem}>
        <div className={styles.companyItemContent}>
          <div className={styles.companyLogoContainer}>
            <div className={styles.companyLogo}>
              <Image
                src={company.logo}
                placeholder={company.logoPlaceholder}
                alt={`${company.name} logo`}
              />
            </div>
          </div>
          <Flex justifyContent="space-between" className={styles.companyInfo}>
            <Flex
              column
              alignItems="center"
              className={company.joblistingCount > 0 && styles.interestingCount}
            >
              <Icon name="briefcase" size={20} />
              <span>{company.joblistingCount}</span>
            </Flex>
            <Flex
              column
              alignItems="center"
              className={company.eventCount > 0 && styles.interestingCount}
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
  const top = useRef<HTMLHeadingElement>(null);

  const companies = useAppSelector((state) => selectActiveCompanies(state));
  const fetching = useAppSelector((state) => state.companies.fetching);
  const { pagination } = useAppSelector((state) =>
    selectPaginationNext({
      query: {},
      entity: 'companies',
      endpoint: '/companies/',
    })(state)
  );
  const hasMore = pagination.hasMore;

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchAll({ fetchMore: false }));
  }, [dispatch]);

  const loggedIn = useAppSelector((state) => selectIsLoggedIn(state));
  if (!loggedIn) {
    return LoginPage;
  }

  return (
    <div className={styles.root}>
      <Helmet title="Bedrifter" />
      <h1 ref={top}>Bedrifter</h1>
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
            className={cx(styles.readMore, 'accordion')}
            onClick={() => setExpanded(true)}
          >
            Vis mer
          </Button>
        )}
        <div className={!expanded && utilities.hiddenOnMobile}>
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
            className={cx(styles.readMore, 'accordion')}
            onClick={() => {
              setExpanded(false);
              top.current?.scrollIntoView();
            }}
          >
            Vis mindre
          </Button>
        </div>
      </div>
      <Flex
        justifyContent="center"
        gap={5}
        className={styles.iconInfoPlacement}
      >
        <Flex>
          <Icon name="briefcase" size={25} />
          <span className={styles.iconInfo}> Aktive jobbannonser</span>
        </Flex>
        <Flex>
          <Icon name="calendar-clear" size={25} />
          <span className={styles.iconInfo}> Kommende arrangementer</span>
        </Flex>
      </Flex>
      <InfiniteScroll
        element="div"
        hasMore={hasMore}
        loadMore={() =>
          hasMore && !fetching && dispatch(fetchAll({ fetchMore: true }))
        }
        initialLoad={false}
        loader={<LoadingIndicator loading />}
      >
        <CompanyList companies={companies} />
      </InfiniteScroll>
    </div>
  );
};

export default CompaniesPage;
