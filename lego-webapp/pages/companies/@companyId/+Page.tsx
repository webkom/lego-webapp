import {
  Button,
  Flex,
  Icon,
  LinkButton,
  LoadingIndicator,
  Page,
  PageCover,
  Skeleton,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { isEmpty } from 'lodash-es';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import CollapsibleDisplayContent from '~/components/CollapsibleDisplayContent';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from '~/components/Content';
import EmptyState from '~/components/EmptyState';
import EventListCompact from '~/components/EventListCompact';
import JoblistingItem from '~/components/JoblistingItem';
import sharedStyles from '~/components/JoblistingItem/JoblistingItem.module.css';
import TextWithIcon from '~/components/TextWithIcon';
import { fetch } from '~/redux/actions/CompanyActions';
import { fetchEvents } from '~/redux/actions/EventActions';
import { fetchAll as fetchAllJoblistings } from '~/redux/actions/JoblistingActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EntityType } from '~/redux/models/entities';
import {
  selectCompanyById,
  selectEventsForCompany,
  selectJoblistingsForCompany,
} from '~/redux/slices/companies';
import { selectPaginationNext } from '~/redux/slices/selectors';
import { useParams } from '~/utils/useParams';
import styles from './Company.module.css';
import type { DetailedCompany } from '~/redux/models/Company';

const CompanyDetail = () => {
  const [viewOldEvents, setViewOldEvents] = useState(false);

  const { companyId } = useParams<{ companyId: string }>() as {
    companyId: string;
  };

  const query = {
    company: companyId,
    ordering: '-start_time',
  };

  const { pagination } = useAppSelector(
    selectPaginationNext({
      endpoint: '/events/',
      entity: EntityType.Events,
      query,
    }),
  );
  const showFetchMoreEvents = pagination.hasMore;
  const fetchingEvents = useAppSelector((state) => state.events.fetching);
  const company = useAppSelector((state) =>
    selectCompanyById<DetailedCompany>(state, companyId),
  );
  const fetchingCompany = useAppSelector((state) => state.companies.fetching);
  const showSkeleton = fetchingCompany && isEmpty(company);
  const companyEvents = useAppSelector((state) =>
    selectEventsForCompany(state, companyId),
  );
  const joblistings = useAppSelector((state) =>
    selectJoblistingsForCompany(state, companyId),
  );
  const fetchingJoblistings = useAppSelector(
    (state) => state.joblistings.fetching,
  );
  const actionGrant = useAppSelector((state) => state.companies.actionGrant);

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchDetailedCompany',
    () =>
      companyId &&
      Promise.allSettled([
        dispatch(fetch(companyId)),
        dispatch(
          fetchEvents({
            query,
          }),
        ),
        dispatch(fetchAllJoblistings({ company: companyId, timeFilter: true })),
      ]),
    [companyId],
  );

  if (!company) return <LoadingIndicator loading />;

  const fetchMoreEvents = () =>
    dispatch(
      fetchEvents({
        query,
        next: true,
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

  const title = company?.name || 'Bedrift';

  return (
    <Page
      cover={
        <PageCover
          image={company?.logo}
          imagePlaceholder={company?.logoPlaceholder}
          skeleton={showSkeleton}
        />
      }
      title={title}
      back={{
        href: '/companies',
      }}
      actionButtons={
        actionGrant.includes('edit') && (
          <LinkButton href={`/bdb/${companyId}`}>Åpne i BDB</LinkButton>
        )
      }
    >
      <Helmet title={title} />

      <ContentSection>
        <ContentMain>
          <CollapsibleDisplayContent
            content={company.description}
            skeleton={showSkeleton}
          />

          <div>
            <h3>Kommende arrangementer</h3>
            <EventListCompact
              events={upcomingEvents}
              noEventsMessage="Ingen kommende arrangementer"
              eventStyle="extra-compact"
              loading={showSkeleton}
              extraCompactSkeletonLimit={1}
            />
          </div>

          <div>
            {oldEvents.length > 0 && (
              <Button
                onPress={() => setViewOldEvents(!viewOldEvents)}
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
                  onPress={fetchMoreEvents}
                />
              </Flex>
            )}
          </div>

          <div>
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
              <EmptyState body="Ingen tilgjengelige jobbannonser" />
            )}
          </div>
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
    </Page>
  );
};

export default CompanyDetail;
