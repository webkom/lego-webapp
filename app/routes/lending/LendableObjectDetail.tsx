import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import type { DetailedLendableObject } from 'app/store/models/LendableObject';
import { useState } from 'react';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { createValidator, required } from 'app/utils/validation';
import { Field } from 'react-final-form';
import { Button, DatePicker, TextArea, TextInput } from 'app/components/Form';
import Modal from 'app/components/Modal';
import moment from 'moment-timezone';

type Params = {
  lendableObjectId: string;
};

const LendableObjectDetail = () => {
  const { lendableObjectId } = useParams<Params>();
  const [showLendingForm, setShowLendingForm] = useState(false);
  const [startString, setStartString] = useState('');
  const [endString, setEndString] = useState('');

  const onSubmit = () => {};

  const lendableObject: DetailedLendableObject = {
    id: lendableObjectId,
    title: 'Soundbox',
    description: 'En soundbox som kan brukes til å spille av lyder',
    lendingCommentPrompt: 'Hvorfor ønsker du å låne soundboks',
    image:
      'https://www.tntpyro.no/wp-content/uploads/2021/08/141_1283224098.jpg',
  };

  return (
    <Content banner={lendableObject.image}>
      <Helmet title={`Utlån av ${lendableObject.title}`} />
      <NavigationTab title={`Utlån av ${lendableObject.title}`}>
        <NavigationLink to="/lending/approve">
          Godkjenn utlånsforespørsler
        </NavigationLink>
      </NavigationTab>
      <p>{lendableObject.description}</p>
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
          setStartString(info.startStr);
          setEndString(info.endStr);
          setShowLendingForm(true);
        }}
      />
      <Modal show={showLendingForm} onHide={() => setShowLendingForm(false)}>
        <LegoFinalForm
          onSubmit={onSubmit}
          validate={validate}
          subscription={{}}
        >
          {({ handleSubmit }) => {
            return (
              <form onSubmit={handleSubmit}>
                <Field
                  label="Start for utlån"
                  name="startTime"
                  defaultValue={moment(startString).format(
                    'DD-MM-YYYY hh:mm:ss'
                  )}
                  component={TextInput.Field}
                  disabled
                />
                <Field
                  label="Slutt for utlån"
                  name="endTime"
                  defaultValue={moment(startString).format(
                    'DD-MM-YYYY hh:mm:ss'
                  )}
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
  );
};

const validate = createValidator({
  responsiblePersonName: [required('Du må oppgi en avsvarsperson')],
});

export default LendableObjectDetail;
