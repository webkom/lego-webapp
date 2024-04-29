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

type Params = {
  lendingRequestId: string;
};

const LendingRequestAdmin = () => {
  const { lendingRequestId } = useParams<Params>();
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchRequest',
    () => dispatch(fetchLendingRequest(Number(lendingRequestId))),
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
          fetchLendingRequestsForLendableObject(request.lendableObject.id as number),
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

  const otherLoans = otherRequests.filter((loan) => !loan.pending);
  const otherLoanRequests = otherRequests.filter((loan) => loan.pending);

  if (!request) {
    return <p>Ukjent forespørsel</p>;
  }

  const requestEvent = {
    id: String(request.id),
    title: request.author?.fullName,
    start: request.startDate,
    end: request.endDate,
    backgroundColor: '#e11617',
    borderColor: '#e11617',
  };

  const otherLoanEvents = otherLoans.map((loan) => ({
    id: String(loan.id),
    title: request.author?.fullName,
    start: loan.startDate,
    end: loan.endDate,
    backgroundColor: '#999999',
    borderColor: '#999999',
  }));

  const otherLoanRequestEvents = otherLoanRequests.map((loan) => ({
    id: String(loan.id),
    title: request?.author?.fullName,
    start: loan.startDate,
    end: loan.endDate,
    backgroundColor: '#f57676',
    borderColor: '#f57676',
  }));

  const infoItems = [
    {
      key: 'Status',
      value: request.pending ? 'Venter på svar' : 'Godkjent',
    },
    {
      key: 'Tidspenn',
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

  return (
    <Content>
      <LoadingIndicator loading={fetching}>
      <Helmet
        title={`Forespørsel om utlån av ${request.lendableObject.title}`}
      />
      <NavigationTab
        title={`Forespørsel om utlån av ${request.lendableObject.title}`}
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
            <h3>Beskjed: </h3>
            {request.message}
          </div>
        </ContentMain>
        <ContentSidebar>
          <InfoList items={infoItems} />
        </ContentSidebar>
      </ContentSection>

      <ContentSection>
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
            events={[requestEvent, otherLoanEvents, otherLoanRequestEvents]}
          />
        </ContentMain>
      </ContentSection>

      {/* <ContentSection>
        <ContentMain>
          <CommentView 
            contentTarget={},
            comments={}
          />
        </ContentMain>
      </ContentSection> */}
      </LoadingIndicator>
    </Content>
  );
};

export default LendingRequestAdmin;
