import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LoadingIndicator, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchLendableObject } from 'app/actions/LendableObjectActions';
import { fetchAllLendingRequests } from 'app/actions/LendingRequestActions';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { selectAllLendingRequests } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const LendableObjectAdminDetail = () => {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchLendableObject',
    () => lendableObjectId && dispatch(fetchLendableObject(lendableObjectId)),
    [lendableObjectId],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId),
  );

  usePreparedEffect(
    'fetchRequests',
    () => dispatch(fetchAllLendingRequests()),
    [],
  );

  const lendingRequests = useAppSelector(selectAllLendingRequests);

  const fetchingRequests = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  if (!lendableObject) {
    return <LoadingPage loading={fetchingRequests} />;
  }

  const title = `Admin: Godkjenn utlån av ${lendableObject.title}`;
  return (
    <Page
      title={title}
      cover={lendableObject.image}
      back={{
        href: '/lending/admin',
      }}
      skeleton={!lendableObject}
    >
      <Helmet title={title} />
      <LoadingIndicator loading={fetchingRequests}>
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
          events={[lendingRequests]}
        />
      </LoadingIndicator>
    </Page>
  );
};

export default LendableObjectAdminDetail;
