import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { lendableObject, otherLoanEvents, otherLoanRequestEvents, request, requestEvent } from './fixtures';

const LendableObjectAdminDetail = () => {

  return (
    <Content banner={lendableObject.image}>
      <Helmet title={`Godkjenn utlån av ${lendableObject.title}`} />
      <NavigationTab title={`Godkjenn utlån av ${lendableObject.title}`} />

      <p>
        {request.message} -{' '}
        <Link to={`/users/${request.user.username}`}>
          {request.user.fullName}
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
