import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { LoadingIndicator, Modal } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchLendableObject } from 'app/actions/LendableObjectActions';
import { Content } from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import {
  Button,
  TextArea,
  TextInput,
} from 'app/components/Form';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import { selectLendableObjectById } from 'app/reducers/lendableObjects';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { createLendingRequest } from 'app/actions/LendingRequestActions';

type Params = {
  lendableObjectId: string;
};

const LendableObjectDetail = () => {
  const { lendableObjectId } = useParams<Params>();
  const [showLendingForm, setShowLendingForm] = useState(false);
  const [start, setstart] = useState('');
  const [end, setend] = useState('');
  const navigate = useNavigate();

  const onSubmit = (values) => {
    dispatch(
      createLendingRequest({
        ...values,
        pending: false,
        lendableObject: lendableObjectId,
      })
    ).then(() => navigate("/lending"));
  };

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchLendableObject',
    () => dispatch(fetchLendableObject(Number(lendableObjectId))),
    []
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById(state, {
      lendableObjectId,
    })
  );

  const initialValues = {
    startTime: moment(start).format('YYYY-MM-DDThh:mm'),
    endTime: moment(end).format('YYYY-MM-DDThh:mm'),
  }

  return (
    <LoadingIndicator loading={!lendableObject}>
      {lendableObject && (
        <Content banner={lendableObject.image}>
          <Helmet title={`Utlån av ${lendableObject.title}`} />

          <NavigationTab title={`Utlån av ${lendableObject.title}`}>
            <NavigationLink to={`/lending/${lendableObject.id}/edit`}>
              Rediger
            </NavigationLink>
          </NavigationTab>

          <DisplayContent content={lendableObject.description} />

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
              setstart(info.startStr);
              setend(info.endStr);
              setShowLendingForm(true);
            }}
          />

          <Modal
            show={showLendingForm}
            onHide={() => setShowLendingForm(false)}
          >
            <LegoFinalForm
              onSubmit={onSubmit}
              initialValues={initialValues}
              subscription={{}}
            >
              {({ handleSubmit }) => {
                return (
                  <form onSubmit={handleSubmit}>
                    <Field
                      label="Start for utlån"
                      name="startTime"
                      component={TextInput.Field}
                      disabled
                    />
                    <Field
                      label="Slutt for utlån"
                      name="endTime"
                      component={TextInput.Field}
                      disabled
                    />
                    <Field
                      label="Kommentar"
                      name="comment"
                      placeholder={lendableObject.lendingCommentPrompt}
                      component={TextArea.Field}
                    />
                    <Button type="submit">Send inn utlånsforespørsel</Button>
                  </form>
                );
              }}
            </LegoFinalForm>
          </Modal>
        </Content>
      )}
    </LoadingIndicator>
  );
};

export default LendableObjectDetail;
