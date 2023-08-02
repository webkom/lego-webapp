import { LoadingIndicator } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Button from 'app/components/Button';
import CollapsibleDisplayContent from 'app/components/CollapsibleDisplayContent';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import EventListCompact from 'app/components/EventListCompact';
import Icon from 'app/components/Icon';
import JoblistingItem from 'app/components/JoblistingItem';
import { Flex } from 'app/components/Layout';
import NavigationTab from 'app/components/NavigationTab';
import TextWithIcon from 'app/components/TextWithIcon';
import type { Event } from 'app/models';
import type { DetailedCompany } from 'app/store/models/Company';
import type { ListJoblisting } from 'app/store/models/Joblisting';
import styles from './Company.css';

type Props = {
  company: DetailedCompany;
  companyEvents: Event[];
  joblistings: ListJoblisting[];
  showFetchMoreEvents: boolean;
  fetchMoreEvents: () => Promise<any>;
  loading: boolean;
};

const CompanyDetail = ({
  company,
  companyEvents,
  joblistings,
  fetchMoreEvents,
  showFetchMoreEvents,
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
          <CollapsibleDisplayContent content={company.description} />
          <h3 className={styles.sectionHeader}>Kommende arrangementer</h3>
          <EventListCompact
            events={upcomingEvents}
            noEventsMessage="Ingen kommende arrangementer"
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
              <EventListCompact
                events={oldEvents}
                noEventsMessage="Ingen tidligere arrangementer"
                eventStyle="extra-compact"
              />
            </>
          )}
          {viewOldEvents && showFetchMoreEvents && (
            <Flex justifyContent="center">
              <Icon
                name="chevron-down-circle-outline"
                size={40}
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
            <span className="secondaryFontColor">
              Ingen tilgjengelige jobbannonser
            </span>
          )}
        </ContentMain>
        {companyInfo.some((info) => info.text) && (
          <ContentSidebar>
            {companyInfo.map(
              (info) =>
                info.text && (
                  <TextWithIcon
                    key={info.text}
                    iconName={info.icon}
                    content={
                      info.link ? (
                        <a href={info.text}>{company.name}</a>
                      ) : (
                        info.text
                      )
                    }
                  />
                )
            )}
          </ContentSidebar>
        )}
      </ContentSection>
    </Content>
  );
};

export default CompanyDetail;
