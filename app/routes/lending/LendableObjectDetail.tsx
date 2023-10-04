import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Line } from 'recharts';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
import type { DetailedLendableObject } from 'app/store/models/LendableObject';

type Params = {
  lendableObjectId: string;
};

const LendableObjectDetail = () => {
  const { lendableObjectId } = useParams<Params>();
  const lendableObject: DetailedLendableObject = {
    id: lendableObjectId,
    title: 'Soundbox',
    description: 'En soundbox som kan brukes til å spille av lyder',
    image:
      'https://www.tntpyro.no/wp-content/uploads/2021/08/141_1283224098.jpg',
  };

  return (
    <Content banner={lendableObject.image}>
      <Helmet title={`Utlån av ${lendableObject.title}`} />
      <NavigationTab title={`Utlån av ${lendableObject.title}`} />
      <p className={styles.}>{lendableObject.description}</p>
      <FullCalendar
        plugins={[interactionPlugin, timeGridPlugin, dayGridPlugin]}
        initialView="timeGridWeek"
        selectable={true}
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
        select={(info) => {
          console.log(info);
        }}
      />
    </Content>
  );
};

export default LendableObjectDetail;
