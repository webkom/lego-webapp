import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Modal } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLendableObject } from 'app/actions/LendableObjectActions';
import { createLendingRequest } from 'app/actions/LendingRequestActions';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import { TextArea, TextInput } from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import SubmitButton from 'app/components/Form/SubmitButton';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

type Params = {
  lendableObjectId: string;
};

const LendableObjectDetail = () => {
  const { lendableObjectId } = useParams<Params>();
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
    <Content banner={lendableObject?.image} skeleton={fetchingObjects}>
      <Helmet title={title} />

      <NavigationTab title={title}>
        <NavigationLink to={`/lending/${lendableObject?.id}/edit`}>
          Rediger
        </NavigationLink>
      </NavigationTab>

      <DisplayContent content={lendableObject?.description} />

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

      <Modal show={showLendingForm} onHide={() => setShowLendingForm(false)}>
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
                  name="comment"
                  component={TextArea.Field}
                />
                <SubmitButton>Send inn forespørsel</SubmitButton>
              </form>
            );
          }}
        </LegoFinalForm>
      </Modal>
    </Content>
  );
};

export default LendableObjectDetail;
