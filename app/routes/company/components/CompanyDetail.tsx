import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'app/components/Button';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import Icon from 'app/components/Icon';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import NavigationTab from 'app/components/NavigationTab';
import { JoblistingItem } from 'app/routes/joblistings/components/JoblistingList';
import { ListEvents } from 'app/routes/users/components/UserProfile';
import type { DetailedCompany } from 'app/store/models/Company';
import type { ListEvent } from 'app/store/models/Event';
import type { ListJoblisting } from 'app/store/models/Joblisting';

import styles from './Company.css';

type Props = {
  company: DetailedCompany;
  companyEvents: ListEvent[];
  joblistings: ListJoblisting[];
  showFetchMoreEvents: boolean;
  fetchMoreEvents: () => Promise<any>;
  loggedIn: boolean;
  loading: boolean;
};

const CompanyDetail = ({
  company,
  companyEvents,
  joblistings,
  fetchMoreEvents,
  showFetchMoreEvents,
  loggedIn,
  loading,
}: Props) => {
  const [viewOldEvents, setViewOldEvents] = useState(false);

  if (!company) {
    return <LoadingIndicator loading={loading} />;
  }

  const sortedEvents = companyEvents.sort(
    (a, b) => moment(b.startTime).unix() - moment(a.startTime).unix()
  );
  const upcomingEvents = sortedEvents.filter((event) =>
    moment().isBefore(moment(event.startTime))
  );
  const oldEvents = sortedEvents.filter((event) =>
    moment().isAfter(moment(event.startTime))
  );

  const companyInfo = [
    {
      text: company.website,
      icon: 'globe-outline',
      link: true,
    },
    {
      text: company.address,
      icon: 'location-outline',
      link: false,
    },
    {
      text: company.phone,
      icon: 'call-outline',
      link: false,
    },
    {
      text: company.companyType,
      icon: 'briefcase-outline',
      link: false,
    },
  ];

  return (
    <Content
      banner={company?.logo}
      bannerPlaceholder={company?.logoPlaceholder}
    >
      <Helmet title={company.name} />
      <NavigationTab
        title={company.name}
        back={{
          label: 'Bedriftsoversikt',
          path: '/companies',
        }}
      />

      <ContentSection>
        <ContentMain>
          <i>
            <DisplayContent content={company.description} />
          </i>
          <h3 className={styles.sectionHeader}>Kommende arrangementer</h3>
          <ListEvents
            events={upcomingEvents}
            noEventsMessage="Ingen kommende arrangementer"
            loggedIn={loggedIn}
            eventStyle="extra-compact"
          />

          {oldEvents.length > 0 && (
            <Button onClick={() => setViewOldEvents(!viewOldEvents)}>
              {viewOldEvents
                ? 'Skjul tidligere arrangementer'
                : 'Vis tidligere arrangementer'}
            </Button>
          )}
          {viewOldEvents && (
            <>
              <h3 className={styles.sectionHeader}>Tidligere arrangementer</h3>
              <ListEvents
                events={oldEvents}
                noEventsMessage="Ingen tidligere arrangementer"
                loggedIn={loggedIn}
                eventStyle="extra-compact"
              />
            </>
          )}
          {viewOldEvents && showFetchMoreEvents && (
            <Flex justifyContent="center">
              <Icon
                name="chevron-down-circle-outline"
                size={35}
                onClick={fetchMoreEvents}
                style={{ cursor: 'pointer' }}
              />
            </Flex>
          )}

          <h3 className={styles.sectionHeader}>Jobbannonser</h3>
          {joblistings.length > 0 ? (
            joblistings.map((joblisting) => (
              <JoblistingItem key={joblisting.id} joblisting={joblisting} />
            ))
          ) : (
            <i>Ingen tilgjengelige jobbannonser</i>
          )}
        </ContentMain>
        <ContentSidebar>
          {companyInfo.map(
            (info) =>
              info.text && (
                <Flex key={info.text}>
                  <Icon name={info.icon} className={styles.infoIcon} />
                  {info.link ? (
                    <a href={info.text}>{company.name}</a>
                  ) : (
                    info.text
                  )}
                </Flex>
              )
          )}
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
};

export default CompanyDetail;
