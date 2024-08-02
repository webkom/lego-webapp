import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  fetchLendingRequest,
  fetchLendingRequestsForLendableObject,
} from 'app/actions/LendingRequestActions';
import {
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import InfoList from 'app/components/InfoList';
import { FromToTime } from 'app/components/Time';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import {
  selectLendingRequestById,
  selectLendingRequestsByLendableObjectId,
} from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import {
  LendingRequestStatus,
  statusToString,
} from 'app/store/models/LendingRequest';
import styles from './LendingRequestAdmin.css';

const LendingRequestAdmin = () => {
  const { lendingRequestId } = useParams<{ lendingRequestId: string }>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchLendingRequest',
    () => lendingRequestId && dispatch(fetchLendingRequest(lendingRequestId)),
    [lendingRequestId],
  );

  const lendingRequest = useAppSelector((state) =>
    selectLendingRequestById(state, Number(lendingRequestId)),
  );
  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendingRequest?.lendableObject),
  );

  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  usePreparedEffect(
    'fetchLendingRequests',
    () => {
      if (lendingRequest && lendingRequest.lendableObject) {
        dispatch(
          fetchLendingRequestsForLendableObject(lendingRequest.lendableObject),
        );
      }
    },
    [lendingRequest?.lendableObject],
  );

  const otherRequests = useAppSelector((state) =>
    selectLendingRequestsByLendableObjectId(
      state,
      lendingRequest?.lendableObject,
    ),
  );

  const otherApprovedRequests = otherRequests.filter(
    (loan) => loan.status === LendingRequestStatus.APPROVED,
  );
  const otherPendingRequests = otherRequests.filter(
    (loan) => loan.status === LendingRequestStatus.PENDING,
  );

  if (!lendingRequest) {
    return <p className="secondaryFontColor">Ukjent forespørsel</p>;
  }

  const requestEvent = {
    id: String(lendingRequest.id),
    title: lendingRequest.author?.fullName,
    start: moment(lendingRequest.startDate).toDate(),
    end: moment(lendingRequest.endDate).toDate(),
    backgroundColor: 'var(--lego-red-color)',
    borderColor: 'var(--lego-red-color)',
  };

  const otherApprovedEvents = otherApprovedRequests.map((loan) => ({
    id: String(loan.id),
    title: lendingRequest.author?.fullName,
    start: loan.startDate,
    end: loan.endDate,
    backgroundColor: 'var(--color-gray-5)',
    borderColor: 'var(--color-gray-5)',
  }));

  const otherPendingEvents = otherPendingRequests.map((loan) => ({
    id: String(loan.id),
    title: lendingRequest?.author?.fullName,
    start: loan.startDate,
    end: loan.endDate,
    backgroundColor: 'var(--color-red-2)',
    borderColor: 'var(--color-red-2)',
  }));

  const infoItems = [
    {
      key: 'Status',
      value: statusToString(lendingRequest.status),
    },
    {
      key: 'Lånetid',
      value: (
        <FromToTime
          from={lendingRequest.startDate}
          to={lendingRequest.endDate}
        />
      ),
    },
    {
      key: 'Bruker',
      value: (
        <Link to={`/users/${lendingRequest.author?.username}`}>
          {lendingRequest.author?.fullName}
        </Link>
      ),
    },
  ];

  const title = `Admin: Forespørsel om utlån av ${lendableObject?.title}`;
  return (
    <Page title={title} back={{ href: '/lending/admin' }}>
      <LoadingIndicator loading={fetching}>
        <Helmet title={title} />

        <ContentSection>
          <ContentMain>
            <div>
              <h3>Kommentar: </h3>
              {lendingRequest.message}
            </div>
          </ContentMain>
          <ContentSidebar>
            <InfoList items={infoItems} />
          </ContentSidebar>
        </ContentSection>

        <ContentSection className={styles.calendarContainer}>
          <ContentMain>
            <FullCalendar
              plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
              initialView="timeGridWeek"
              slotDuration={'01:00:00'}
              nowIndicator
              expandRows
              slotLabelInterval={'02:00:00'}
              slotLabelFormat={{
                timeStyle: 'short',
              }}
              allDaySlot={false}
              locale="nb"
              firstDay={1}
              headerToolbar={{
                left: 'prev,today,next',
                center: 'title',
                right: 'timeGridWeek,dayGridMonth',
              }}
              events={[requestEvent, otherApprovedEvents, otherPendingEvents]}
            />
          </ContentMain>
        </ContentSection>
      </LoadingIndicator>
    </Page>
  );
};

export default LendingRequestAdmin;
