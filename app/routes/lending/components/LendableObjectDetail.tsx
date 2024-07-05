import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LinkButton, Modal, Page, PageCover } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLendableObject } from 'app/actions/LendableObjectActions';
import { createLendingRequest } from 'app/actions/LendingRequestActions';
import DisplayContent from 'app/components/DisplayContent';
import { TextArea, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmitButton from 'app/components/Form/SubmitButton';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const LendableObjectDetail = () => {
  const { lendableObjectId } = useParams<{ lendableObjectId: string }>();
  const [showLendingForm, setShowLendingForm] = useState(false);
  const [start, setStart] = useState('');
  const [end, setEnd] = useState('');
  const navigate = useNavigate();

  const onSubmit = (values) => {
    values = {
      ...values,
      startDate: moment(values.startDate).toISOString(),
      endDate: moment(values.endDate).toISOString(),
    };

    dispatch(
      createLendingRequest({
        ...values,
        pending: false,
        lendableObject: lendableObjectId,
      }),
    ).then(() => navigate('/lending'));
  };

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchLendableObject',
    () => lendableObjectId && dispatch(fetchLendableObject(lendableObjectId)),
    [lendableObjectId],
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, lendableObjectId),
  );

  const fetchingObjects = useAppSelector(
    (state) => state.lendableObjects.fetching,
  );

  const initialValues = {
    startDate: moment(start).toISOString(),
    endDate: moment(end).toISOString(),
  };

  const title = `Utlån av ${lendableObject?.title}`;
  return (
    <Page
      title={title}
      back={{ href: '/lending' }}
      cover={<PageCover image={lendableObject?.image} />}
      actionButtons={
        <LinkButton href={`/lending/${lendableObject?.id}/edit`}>
          Rediger
        </LinkButton>
      }
      skeleton={fetchingObjects}
    >
      <Helmet title={title} />

      {lendableObject && 'description' in lendableObject && (
        <DisplayContent content={lendableObject.description} />
      )}

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
          setStart(info.startStr);
          setEnd(info.endStr);
          setShowLendingForm(true);
        }}
      />

      <Modal isOpen={showLendingForm} onOpenChange={setShowLendingForm}>
        <LegoFinalForm
          onSubmit={onSubmit}
          initialValues={initialValues}
          subscription={{}}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  label="Starttidspunkt for utlån"
                  name="startDate"
                  component={TextInput.Field}
                  disabled
                />
                <Field
                  label="Sluttidspunkt for utlån"
                  name="endDate"
                  component={TextInput.Field}
                  disabled
                />
                <Field
                  label="Kommentar"
                  name="message"
                  component={TextArea.Field}
                />
                <SubmitButton>Send inn forespørsel</SubmitButton>
              </form>
            );
          }}
        </LegoFinalForm>
      </Modal>
    </Page>
  );
};

export default LendableObjectDetail;
