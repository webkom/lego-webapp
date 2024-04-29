import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LoadingIndicator } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchLendableObject } from 'app/actions/LendableObjectActions';
import { fetchAllLendingRequests } from 'app/actions/LendingRequestActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { selectAllLendingRequests } from 'app/reducers/lendingRequests';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import type { Params } from 'react-router-dom';

const LendableObjectAdminDetail = () => {
  const { lendableObjectId } = useParams<Params>();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchLendableObject',
    () => dispatch(fetchLendableObject(Number(lendableObjectId))),
    [],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, {
      lendableObjectId,
    }),
  );

  usePreparedEffect(
    'fetchRequests',
    () => dispatch(fetchAllLendingRequests()),
    [],
  );

  const lendingRequests = useAppSelector((state) =>
    selectAllLendingRequests(state),
  );

  const fetchingRequests = useAppSelector(
    (state) => state.lendingRequests.fetching,
  );

  if (!lendableObject) {
    return (
      <Content>
        <LoadingIndicator loading />
      </Content>
    );
  }

  return (
    <LoadingIndicator loading={fetchingRequests}>
      <Content banner={lendableObject.image}>
        <Helmet title={`Godkjenn utlån av ${lendableObject.title}`} />
        <NavigationTab title={`Godkjenn utlån av ${lendableObject.title}`} />

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
      </Content>
    </LoadingIndicator>
  );
};

export default LendableObjectAdminDetail;
