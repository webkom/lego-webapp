// @flow

import * as React from 'react';
import styles from './CompaniesPage.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import InfiniteScroll from 'react-infinite-scroller';
import { Link } from 'react-router-dom';
import { Image } from 'app/components/Image';
import type { Company } from 'app/models';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import utilities from 'app/styles/utilities.css';
import cx from 'classnames';

type Props = {
  companies: Array<Company>,
  fetchMore: () => void,
  showFetchMore: () => void,
  hasMore: boolean,
  fetching: boolean
};

const CompanyItem = ({ company }: Company) => {
  return (
    <div className={styles.companyItem}>
      <div className={styles.companyItemContent}>
        <div className={styles.companyLogoContainer}>
          <Link to={`/companies/${company.id}`}>
            <div className={styles.companyLogo}>
              {<Image src={company.logo} />}
            </div>
          </Link>
        </div>
        <Flex className={styles.companyInfo}>
          <Flex column>
            <Icon name="md-briefcase" prefix="ion-" size={20} />
            <span className={styles.briefcaseCount}>
              {company.joblistingCount}
            </span>
          </Flex>
          {company.website && (
            <div className={styles.iconLink}>
              <a
                href={company.website}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Flex column>
                  <Icon
                    name="at"
                    size={20}
                    style={{ color: 'var(--lego-link-color)' }}
                  />
                  <span />
                  Link her
                </Flex>
              </a>
            </div>
          )}
          <Flex column>
            <Icon name="md-calendar" prefix="ion-" size={20} />
            <span className={styles.calendarCount}>{company.eventCount}</span>
          </Flex>
        </Flex>
      </div>
    </div>
  );
};

type CompanyListProps = {
  companies: Array<Company>
};

const CompanyList = ({ companies = [] }: CompanyListProps) => (
  <div className={styles.companyList}>
    {companies.map((company, id) => (
      <CompanyItem key={id} company={company} />
    ))}
  </div>
);

type State = { expanded: boolean };
class CompaniesPage extends React.Component<Props, State> {
  state = { expanded: false };
  top = React.createRef();
  render() {
    const { props } = this;

    return (
      <div className={styles.root}>
        <h2 ref={this.top} className={styles.heading}>
          Bedrifter
        </h2>
        <div>
          <p className={styles.infoText}>
            Vil du jobbe som in-house utvikler i din drømmebedrift? Ser du for
            deg en hverdag som konsulent på oppdrag hos de kuleste kundene? Er
            sikkerhet din greie, eller drømmer du om å drive med spillutvikling
            på heltid? På denne siden har vi samlet et utvalg potensielle
            arbeidsgivere for deg som student, som gjenspeiler mangfoldet du har
            i jobbmuligheter.
          </p>
          {!this.state.expanded && (
            <button
              className={cx(styles.readMore, 'accordion')}
              onClick={() => {
                this.setState({ expanded: true });
              }}
            >
              Vis mer
            </button>
          )}
          <div className={this.state.expanded ? ' ' : utilities.hiddenOnMobile}>
            <p className={styles.infoText}>
              Trykk deg inn på en bedrift for å se hva slags type bedrift det
              er, les mer om hva de jobber med og se hvor de holder til. Bla deg
              gjennom en oversikt over tidligere eller kommende arrangementer og
              se hvem som har jobbannonser ute for øyeblikket. Hvis du vil lese
              mer om bedriften så kan du navigere deg til nettsiden deres via
              linken.
            </p>

            <p className={styles.infoText}>
              Savner du en bedrift? Savner du noe informasjon om en bedrift? Ta
              kontakt med Bedkom, vi tar gjerne imot innspill!
            </p>
            <button
              className={cx(styles.readMore, 'accordion')}
              onClick={() => {
                this.setState({ expanded: false });
                this.top.current && this.top.current.scrollIntoView();
              }}
            >
              Vis mindre
            </button>
          </div>
        </div>
        <div className={styles.iconInfoPlacement}>
          <Flex row>
            <Icon name="md-briefcase" prefix="ion-" size={25} />
            <span className={styles.iconInfo}> Aktive jobbannonser</span>
          </Flex>
          <Flex row>
            <Icon name="at" size={25} />
            <span className={styles.iconInfo}> Nettside</span>
          </Flex>
          <Flex row>
            <Icon name="md-calendar" prefix="ion-" size={25} />
            <span className={styles.iconInfo}> Kommende arrangementer</span>
          </Flex>
        </div>
        <div id="nav" className={styles.navigationBar} />
        <InfiniteScroll
          element="div"
          hasMore={props.hasMore}
          loadMore={() => props.hasMore && !props.fetching && props.fetchMore()}
          initialLoad={false}
          loader={<LoadingIndicator loading />}
        >
          <CompanyList companies={props.companies} />
        </InfiniteScroll>
      </div>
    );
  }
}

export default CompaniesPage;
