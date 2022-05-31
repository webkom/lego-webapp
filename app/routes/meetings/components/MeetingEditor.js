// @flow

import { Helmet } from 'react-helmet-async';
import styles from './MeetingEditor.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Field } from 'redux-form';
import { AttendanceStatus } from 'app/components/UserAttendance';
import NavigationTab from 'app/components/NavigationTab';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import { useHistory } from 'react-router-dom';

import {
  Form,
  TextArea,
  TextInput,
  EditorField,
  SelectInput,
  Button,
  DatePicker,
  legoForm,
  CheckBox,
} from 'app/components/Form';
import moment from 'moment-timezone';
import config from 'app/config';
import { unionBy } from 'lodash';
import type { UserEntity } from 'app/reducers/users';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import { Flex } from 'app/components/Layout';

type Props = {
  handleSubmit: (Object) => void,
  handleSubmitCallback: (Object) => Promise<*>,
  meetingId?: string,
  meeting: Object,
  change: () => void,
  invitingUsers: Array<UserEntity>,
  user: UserEntity,
  pristine: boolean,
  submitting: boolean,
  meetingInvitations: Array<Object>,
  push: (string) => void,
  inviteUsersAndGroups: (Object) => Promise<*>,
  initialized: boolean,
  deleteMeeting: (number) => Promise<*>,
};

function MeetingEditor({
  handleSubmit,
  meetingId,
  meeting,
  change,
  invitingUsers = [],
  user,
  submitting,
  pristine,
  meetingInvitations,
  push,
  initialized,
  deleteMeeting,
}: Props) {
  const history = useHistory();

  const isEditPage = meetingId !== undefined;

  if (isEditPage && !meeting) {
    return <LoadingIndicator loading />;
  }

  const userSearchable = {
    value: user.username,
    label: user.fullName,
    id: user.id,
  };

  const invitedUsersSearchable = meetingInvitations
    ? meetingInvitations.map((invite) => ({
        value: invite.user.username,
        label: invite.user.fullName,
        id: invite.user.id,
      }))
    : [];

  const possibleReportAuthors = unionBy(
    [userSearchable],
    invitedUsersSearchable,
    invitingUsers,
    'value'
  );

  const onDeleteMeeting = async () =>
    await deleteMeeting(meeting?.id).then(() => history.push('/meetings/'));

  const actionGrant = meeting?.actionGrant;
  const canDelete = actionGrant?.includes('delete');

  return (
    <div className={styles.root}>
      <Helmet
        title={isEditPage ? `Redigerer: ${meeting.title}` : 'Nytt møte'}
      />
      <NavigationTab
        title={isEditPage ? `Redigerer: ${meeting.title}` : 'Nytt møte'}
        className={styles.detailTitle}
        back={{ label: 'Mine møter', path: '/meetings' }}
      />
      <Form onSubmit={handleSubmit}>
        <Field
          name="title"
          label="Tittel"
          placeholder="Ny tittel for møte"
          component={TextInput.Field}
        />
        <h3>Møtereferat</h3>
        <Field
          name="report"
          label="Referat"
          component={EditorField.Field}
          initialized={initialized}
        />
        <Field
          label="Kort beskrivelse"
          placeholder="Dette vises i kalenderen til de inviterte, så gjerne putt zoom-lenka her..."
          name="description"
          component={TextArea.Field}
        />
        <div className={styles.sideBySideBoxes}>
          <div>
            <Field
              name="startTime"
              label="Starttidspunkt"
              component={DatePicker.Field}
            />
          </div>
          <div>
            <Field
              name="endTime"
              label="Sluttidspunkt"
              component={DatePicker.Field}
            />
          </div>
        </div>

        <Field
          label="Bruk mazemap"
          name="useMazemap"
          component={CheckBox.Field}
          fieldClassName={styles.metaField}
          className={styles.formField}
          normalize={(v) => !!v}
        />
        {!meeting.useMazemap ? (
          <Field
            name="location"
            label="Sted"
            placeholder="Sted for møte"
            component={TextInput.Field}
          />
        ) : (
          <Flex alignItems="center">
            <Field
              label="Mazemap-rom"
              name="mazemapPoi"
              component={SelectInput.MazemapAutocomplete}
              fieldClassName={styles.metaField}
              placeholder="R1, Abakus, Kjel4"
            />
            {meeting?.mazemapPoi?.value > 0 && (
              <MazemapLink
                mazemapPoi={meeting.mazemapPoi?.value}
                linkText="↗️"
              />
            )}
          </Flex>
        )}
        <Field
          name="reportAuthor"
          label="Referent"
          placeholder="La denne stå åpen for å velge deg selv"
          options={possibleReportAuthors}
          component={SelectInput.Field}
        />
        <div className={styles.sideBySideBoxes}>
          <div>
            <Field
              name="users"
              filter={['users.user']}
              label="Invitere brukere"
              placeholder="Skriv inn brukernavn på de du vil invitere"
              component={SelectInput.AutocompleteField}
              isMulti
            />
          </div>
          <div>
            <Field
              name="groups"
              filter={['users.abakusgroup']}
              label="Invitere grupper"
              placeholder="Skriv inn gruppene du vil invitere"
              component={SelectInput.AutocompleteField}
              isMulti
            />
          </div>
        </div>
        {isEditPage && <h3> Allerede inviterte </h3>}
        {isEditPage && (
          <div>
            <AttendanceStatus.Modal
              pools={[
                {
                  name: 'Inviterte brukere',
                  registrations: meetingInvitations,
                },
              ]}
            />
            <br />
          </div>
        )}

        <Button success={isEditPage} disabled={pristine || submitting} submit>
          {isEditPage ? 'Lagre endringer' : 'Opprett møte'}
        </Button>
        {isEditPage && canDelete && (
          <ConfirmModalWithParent
            title="Slett møte"
            message="Er du sikker på at du vil slette møtet?"
            onConfirm={onDeleteMeeting}
          >
            <Button danger>Slett møte</Button>
          </ConfirmModalWithParent>
        )}
      </Form>
    </div>
  );
}
const validate = (values) => {
  const errors = {};
  if (!values.title) {
    errors.title = 'Du må gi møtet en tittel';
  }
  if (!values.report) {
    errors.report = 'Referatet kan ikke være tomt';
  }
  if (!values.location) {
    errors.location = 'Du må velge en lokasjon for møtet';
  }
  if (values.useMazemap && !values.mazemapPoi) {
    errors.mazemapPoi = 'Sted eller Mazemap-rom er påkrevd.';
  }
  if (!values.endTime) {
    errors.endTime = 'Du må velge starttidspunkt';
  }
  if (!values.startTime) {
    errors.startTime = 'Du må velge sluttidspunkt';
  }

  const startTime = moment.tz(values.startTime, config.timezone);

  const endTime = moment.tz(values.endTime, config.timezone);
  if (startTime > endTime) {
    errors.endTime = 'Sluttidspunkt kan ikke være før starttidspunkt!';
  }
  return errors;
};

export default legoForm({
  form: 'meetingEditor',
  validate,
  onSubmit: (
    data,
    dispatch,
    { push, handleSubmitCallback, inviteUsersAndGroups }: Props
  ) =>
    handleSubmitCallback(data).then((result) => {
      const id = data.id || result.payload.result;
      const { groups, users } = data;
      if (groups || users) {
        return inviteUsersAndGroups({ id, users, groups }).then(() =>
          push(`/meetings/${id}`)
        );
      }
      push(`/meetings/${id}`);
    }),
})(MeetingEditor);
