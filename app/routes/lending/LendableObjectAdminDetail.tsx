import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment-timezone';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import type { DetailedLendableObject } from 'app/store/models/LendableObject';

type Params = {
  lendableObjectId: string;
};

const LendableObjectAdminDetail = () => {
  const { lendableObjectId } = useParams<Params>();

  const lendingRequest = {
    id: 1,
    user: {
      id: 1,
      username: 'Eik',
      fullName: 'Test Testesen',
    },
    message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
    startTime: moment().subtract({ hours: 2 }),
    endTime: moment(),
    approved: false,
  };

  const lendableObject: DetailedLendableObject = {
    id: lendableObjectId,
    title: 'Soundbox',
    description: 'En soundbox som kan brukes til å spille av lyder',
    lendingCommentPrompt: 'Hvorfor ønsker du å låne soundboks',
    image:
      'https://www.tntpyro.no/wp-content/uploads/2021/08/141_1283224098.jpg',
  };

  const otherLoans = [
    {
      id: 2,
      startTime: moment().subtract({ days: 1, hours: 2 }),
      endTime: moment().subtract({ hours: 8 }),
    },
    {
      id: 3,
      startTime: moment().subtract({ hours: 6 }),
      endTime: moment().subtract({ hours: 2 }),
    },
  ];

  const requestEvent = {
    id: String(lendingRequest.id),
    title: lendingRequest.user.fullName,
    start: lendingRequest.startTime.toISOString(),
    end: lendingRequest.endTime.toISOString(),
    backgroundColor: '#e11617',
    borderColor: '#e11617',
  };

  const otherLoanEvents = otherLoans.map((loan) => ({
    id: String(loan.id),
    title: 'Test',
    start: loan.startTime.toISOString(),
    end: loan.endTime.toISOString(),
    backgroundColor: '#999999',
    borderColor: '#999999',
  }));

  const otherLoanRequests = [
    {
      id: 5,
      startTime: moment().subtract({ hours: 2 }),
      endTime: moment().add({ hours: 2 }),
    },
  ];

  const otherLoanRequestEvents = otherLoanRequests.map((loan) => ({
    id: String(loan.id),
    title: 'Test',
    start: loan.startTime.toISOString(),
    end: loan.endTime.toISOString(),
    backgroundColor: '#f57676',
    borderColor: '#f57676',
  }));

  return (
    <Content banner={lendableObject.image}>
      <Helmet title={`Godkjenn utlån av ${lendableObject.title}`} />
      <NavigationTab
        title={`Godkjenn utlån av ${lendableObject.title}`}
      ></NavigationTab>
      <p>
        {lendingRequest.message} -{' '}
        <Link to={`/users/${lendingRequest.user.username}`}>
          {lendingRequest.user.fullName}
        </Link>{' '}
      </p>
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
        events={[requestEvent, ...otherLoanEvents, ...otherLoanRequestEvents]}
      />
    </Content>
  );
};

export default LendableObjectAdminDetail;
