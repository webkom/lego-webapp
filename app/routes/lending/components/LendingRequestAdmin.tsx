import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import moment from 'moment';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { Content, ContentMain, ContentSection, ContentSidebar } from 'app/components/Content';
import InfoList from 'app/components/InfoList';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { FromToTime } from 'app/components/Time';
import { LendingRequestStatus } from './RequestItem';
import type { DetailedLendableObject } from 'app/store/models/LendableObject';
// import { CommentView } from 'app/components/Comments';

type Params = {
  requestId: string;
}

const LendingRequestAdmin = () => {

  const { requestId } = useParams<Params>();

  const lendableObject: DetailedLendableObject = {
    id: 1,
    title: 'Soundbox',
    description: 'En soundbox som kan brukes til å spille av lyder',
    lendingCommentPrompt: 'Hvorfor ønsker du å låne soundboks',
    image:
      'https://www.tntpyro.no/wp-content/uploads/2021/08/141_1283224098.jpg',
  };


  const request = {
    id: 1,
    user: {
      username: "PeterTesterIProd",
      fullName: "Peter TesterIProd"
    },
    startTime: moment().subtract({ hours: 2 }),
    endTime: moment(),
    message: 'Jeg vil gjerne låne Soundboks til hyttetur:)',
    status: LendingRequestStatus.PENDING,
    lendableObject: {
      id: 1,
      title: 'Grill',
      image: 'https://food.unl.edu/newsletters/images/grilled-kabobs.jpg',
    },
  }

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
    id: String(request.id),
    title: request.user.fullName,
    start: request.startTime.toISOString(),
    end: request.endTime.toISOString(),
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

  const infoItems = [
    {
      key: 'Status',
      value: request.status,
    },
    {
      key: 'Tidspenn',
      value: <FromToTime from={request.startTime} to={request.endTime} />,
    },
    {
      key: 'Bruker',
      value: <Link to={`/users/${request.user.username}`}>{request.user.fullName}</Link>,
    }
  ];

  return (
    <Content>
      <Helmet title={`Forespørsel om utlån av ${lendableObject.title}`} />
      <NavigationTab 
        title={`Forespørsel om utlån av ${lendableObject.title}`}
        back={{
          label: 'Tilbake',
          path: '/lending/admin'
        }}
      >
        <NavigationLink to={`/lending/request/${requestId}/admin`}>
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
          events={[requestEvent, ...otherLoanEvents, ...otherLoanRequestEvents]}
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

    </Content>
  );
};

export default LendingRequestAdmin;
