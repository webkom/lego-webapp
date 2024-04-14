import {
  Button,
  Flex,
  Icon,
  LoadingIndicator,
  Skeleton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetch, fetchEventsForCompany } from 'app/actions/CompanyActions';
import { getEndpoint } from 'app/actions/EventActions';
import { fetchAll as fetchAllJoblistings } from 'app/actions/JoblistingActions';
import CollapsibleDisplayContent from 'app/components/CollapsibleDisplayContent';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import EventListCompact from 'app/components/EventListCompact';
import JoblistingItem from 'app/components/JoblistingItem';
import sharedStyles from 'app/components/JoblistingItem/JoblistingItem.css';
import NavigationTab from 'app/components/NavigationTab';
import TextWithIcon from 'app/components/TextWithIcon';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectJoblistingsForCompany,
} from 'app/reducers/companies';
import { selectPagination } from 'app/reducers/selectors';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import createQueryString from 'app/utils/createQueryString';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import styles from './Company.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { DetailedCompany } from 'app/store/models/Company';
import type { ListEvent } from 'app/store/models/Event';

const queryString = (companyId?: EntityId) =>
  createQueryString({
    company: companyId,
    ordering: '-start_time',
  });

const CompanyDetail = () => {
  const [viewOldEvents, setViewOldEvents] = useState(false);

  const { companyId } = useParams<{ companyId: string }>() as {
    companyId: string;
  };
  const showFetchMoreEvents = useAppSelector((state) =>
    selectPagination('events', {
      queryString: queryString(companyId),
    })(state),
  );
  const fetchingEvents = useAppSelector((state) => state.events.fetching);
  const company = useAppSelector((state) =>
    selectCompanyById<DetailedCompany>(state, companyId),
  );
  const fetchingCompany = useAppSelector((state) => state.companies.fetching);
  const showSkeleton = fetchingCompany && isEmpty(company);
  const companyEvents = useAppSelector((state) =>
    selectEventsForCompany(state, companyId),
  ) as ListEvent[];
  const joblistings = useAppSelector((state) =>
    selectJoblistingsForCompany(state, companyId),
  );
  const fetchingJoblistings = useAppSelector(
    (state) => state.joblistings.fetching,
  );
  const pagination = useAppSelector((state) => state.events.pagination);
  const endpoint = getEndpoint(pagination, queryString(companyId));

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailedCompany',
    () =>
      companyId &&
      Promise.allSettled([
        dispatch(fetch(companyId)),
        dispatch(
          fetchEventsForCompany({
            endpoint: `/events/${queryString(companyId)}`,
            queryString: queryString(companyId),
          }),
        ),
        dispatch(fetchAllJoblistings({ company: companyId, timeFilter: true })),
      ]),
    [companyId],
  );

  if (!company) return <LoadingIndicator loading />;

  const fetchMoreEvents = () =>
    companyId &&
    dispatch(
      fetchEventsForCompany({
        endpoint,
        queryString: queryString(companyId),
      }),
    );

  const sortedEvents = companyEvents.sort(
    (a, b) => moment(b.startTime).unix() - moment(a.startTime).unix(),
  );
  const upcomingEvents = sortedEvents.filter((event) =>
    moment().isBefore(moment(event.startTime)),
  );
  const oldEvents = sortedEvents.filter((event) =>
    moment().isAfter(moment(event.startTime)),
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
      skeleton={showSkeleton}
    >
      <Helmet title={company?.name || 'Bedrift'} />
      <NavigationTab
        title={company.name}
        back={{
          label: 'Bedriftsoversikt',
          path: '/companies',
        }}
        skeleton={showSkeleton}
      />

      <ContentSection>
        <ContentMain>
          <CollapsibleDisplayContent
            content={company.description}
            skeleton={showSkeleton}
          />

          <h3>Kommende arrangementer</h3>
          <EventListCompact
            events={upcomingEvents}
            noEventsMessage="Ingen kommende arrangementer"
            eventStyle="extra-compact"
            loading={showSkeleton}
            extraCompactSkeletonLimit={1}
          />
          {oldEvents.length > 0 && (
            <Button
              onClick={() => setViewOldEvents(!viewOldEvents)}
              className={styles.toggleEventsView}
            >
              {viewOldEvents
                ? 'Skjul tidligere arrangementer'
                : 'Vis tidligere arrangementer'}
            </Button>
          )}

          {viewOldEvents && (
            <>
              <h3>Tidligere arrangementer</h3>
              <EventListCompact
                events={oldEvents}
                noEventsMessage="Ingen tidligere arrangementer"
                eventStyle="extra-compact"
                loading={fetchingEvents}
              />
            </>
          )}
          {viewOldEvents && showFetchMoreEvents && (
            <Flex justifyContent="center">
              <Icon
                name="chevron-down-outline"
                size={30}
                onClick={fetchMoreEvents}
              />
            </Flex>
          )}

          <h3>Jobbannonser</h3>
          {fetchingJoblistings && !joblistings.length ? (
            <Skeleton className={sharedStyles.joblistingItem} />
          ) : joblistings.length > 0 ? (
            <Flex column gap="var(--spacing-sm)">
              {joblistings.map((joblisting) => (
                <JoblistingItem key={joblisting.id} joblisting={joblisting} />
              ))}
            </Flex>
          ) : (
            <span className="secondaryFontColor">
              Ingen tilgjengelige jobbannonser
            </span>
          )}
        </ContentMain>

        <ContentSidebar>
          {showSkeleton
            ? companyInfo.map((info, index) => (
                <TextWithIcon
                  key={index}
                  iconName={info.icon}
                  content={<Skeleton className={styles.companyInfo} />}
                />
              ))
            : companyInfo.some((info) => info.text) &&
              companyInfo.map(
                (info) =>
                  info.text && (
                    <TextWithIcon
                      key={info.text}
                      iconName={info.icon}
                      className={styles.companyInfo}
                      content={
                        info.link ? (
                          <a href={info.text}>{company.name}</a>
                        ) : (
                          info.text
                        )
                      }
                    />
                  ),
              )}
        </ContentSidebar>
      </ContentSection>
    </Content>
  );
};

export default guardLogin(CompanyDetail);
