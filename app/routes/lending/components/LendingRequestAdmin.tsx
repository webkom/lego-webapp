import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import {
  fetchLendingRequest,
  fetchLendingRequestsForLendableObject,
} from 'app/actions/LendingRequestActions';
import {
  Content,
  ContentMain,
  ContentSection,
  ContentSidebar,
} from 'app/components/Content';
import InfoList from 'app/components/InfoList';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { FromToTime } from 'app/components/Time';
import {
  selectLendingRequestById,
  selectLendingRequestsByLendableObjectId,
} from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { LendingRequestStatus, statusToString } from 'app/store/models/LendingRequest';
import styles from './LendingRequestAdmin.css';

type Params = {
  lendingRequestId: string;
};

const LendingRequestAdmin = () => {
  const { lendingRequestId } = useParams<Params>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRequest',
    () => dispatch(fetchLendingRequest(lendingRequestId)),
    [],
  );

  const request = useAppSelector((state) =>
    selectLendingRequestById(state, Number(lendingRequestId)),
  );

  const fetching = useAppSelector((state) => state.lendableObjects.fetching);

  usePreparedEffect(
    'fetchRequests',
    () => {
      if (request && request.lendableObject?.id) {
        dispatch(
          fetchLendingRequestsForLendableObject(request.lendableObject.id),
        );
      }
    },
    [request?.lendableObject.id],
  );

  const otherRequests = useAppSelector((state) =>
    selectLendingRequestsByLendableObjectId(state, {
      lendableObjectId: request?.lendableObject.id,
    }),
  );

  console.log(otherRequests)

  const otherApprovedRequests = otherRequests.filter((loan) => loan.status === LendingRequestStatus.APPROVED);
  const otherPendingRequests = otherRequests.filter((loan) => loan.status === LendingRequestStatus.PENDING);

  if (!request) {
    return <p className="secondaryFontColor">Ukjent forespørsel</p>;
  }

  const requestEvent = {
    id: String(request.id),
    title: request.author?.fullName,
    start: request.startDate,
    end: request.endDate,
    backgroundColor: 'var(--lego-red-color)',
    borderColor: 'var(--lego-red-color)',
  };

  const otherApprovedEvents = otherApprovedRequests.map((loan) => ({
    id: String(loan.id),
    title: request.author?.fullName,
    start: loan.startDate,
    end: loan.endDate,
    backgroundColor: 'var(--color-gray-5)',
    borderColor: 'var(--color-gray-5)',
  }));

  const otherPendingEvents = otherPendingRequests.map((loan) => ({
    id: String(loan.id),
    title: request?.author?.fullName,
    start: loan.startDate,
    end: loan.endDate,
    backgroundColor: 'var(--color-red-2)',
    borderColor: 'var(--color-red-2)',
  }));

  const infoItems = [
    {
      key: 'Status',
      value: statusToString(request.status),
    },
    {
      key: 'Lånetid',
      value: <FromToTime from={request.startDate} to={request.endDate} />,
    },
    {
      key: 'Bruker',
      value: (
        <Link to={`/users/${request.author?.username}`}>
          {request.author?.fullName}
        </Link>
      ),
    },
  ];

  const title = `Forespørsel om utlån av ${request.lendableObject.title}`;
  return (
    <Content>
      <LoadingIndicator loading={fetching}>
        <Helmet title={title} />
        <NavigationTab
          title={title}
          back={{
            label: 'Tilbake',
            path: '/lending/admin',
          }}
        >
          <NavigationLink to={`/lending/request/${lendingRequestId}/admin`}>
            Admin
          </NavigationLink>
        </NavigationTab>

        <ContentSection>
          <ContentMain>
            <div>
              <h3>Kommentar: </h3>
              {request.message}
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
    </Content>
  );
};

export default LendingRequestAdmin;
