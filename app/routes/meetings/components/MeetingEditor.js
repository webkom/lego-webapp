// @flow

import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { useHistory } from 'react-router-dom';
import { unionBy } from 'lodash';

import {
  Button,
  CheckBox,
  DatePicker,
  EditorField,
  Form,
  SelectInput,
  TextArea,
  TextInput,
} from 'app/components/Form';
import { RenderErrorMessage } from 'app/components/Form/Field';
import LegoFinalForm from 'app/components/Form/LegoFinalForm';
import { Flex } from 'app/components/Layout';
import LoadingIndicator from 'app/components/LoadingIndicator';
import MazemapLink from 'app/components/MazemapEmbed/MazemapLink';
import { ConfirmModalWithParent } from 'app/components/Modal/ConfirmModal';
import NavigationTab from 'app/components/NavigationTab';
import { AttendanceStatus } from 'app/components/UserAttendance';
import type { UserEntity } from 'app/reducers/users';
import styles from 'app/routes/meetings/components/MeetingEditor.css';
import {
  spyFormError,
  spySubmittable,
  spyValues,
} from 'app/utils/formSpyUtils';
import {
  createValidator,
  ifField,
  ifNotField,
  legoEditorRequired,
  required,
  timeIsAfter,
} from 'app/utils/validation';

type Values = {
  title?: string,
  report?: string,
  description?: string,
  startTime?: string,
  endTime?: string,
  useMazemap: boolean,
  mazemapPoi?: number,
  location?: string,
  users?: Array<Object>,
};

type Props = {
  meetingId?: string,
  meeting: Object,
  user: UserEntity,
  meetingInvitations: Array<Object>,
  initialValues: Values,
  handleSubmitCallback: (data: Values) => Promise<any>,
  push: (string) => void,
  inviteUsersAndGroups: (Object) => Promise<*>,
  deleteMeeting: (number) => Promise<*>,
};

const validate = createValidator({
  title: [required('Du må gi møtet en tittel')],
  report: [legoEditorRequired('Referatet kan ikke være tomt')],
  location: [
    ifNotField('useMazemap', required('Sted eller Mazemap-rom er påkrevd')),
  ],
  mazemapPoi: [
    ifField('useMazemap', required('Sted eller Mazemap-rom er påkrevd')),
  ],
  startTime: [required('Du må velge starttidspunkt')],
  endTime: [
    required('Du må velge sluttidspunkt'),
    timeIsAfter('startTime', 'Sluttidspunkt kan ikke være før starttidspunkt'),
  ],
});

const MeetingEditor = ({
  meetingId,
  meeting,
  user,
  meetingInvitations,
  initialValues,
  handleSubmitCallback,
  push,
  deleteMeeting,
  inviteUsersAndGroups,
}: Props) => {
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

  const onSubmit = (values) =>
    handleSubmitCallback(values).then((result) => {
      const id = meetingId || result.payload.result;
      const { groups, users } = values;
      if (groups || users) {
        return inviteUsersAndGroups({ id, users, groups }).then(() =>
          push(`/meetings/${id}`)
        );
      }
      push(`/meetings/${id}`);
    });

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
      <LegoFinalForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => {
          return (
            <Form onSubmit={handleSubmit}>
              <Field
                name="title"
                label="Tittel"
                placeholder="Ny tittel for møte"
                component={TextInput.Field}
              />
              <Field
                name="report"
                label="Referat"
                component={EditorField.Field}
              />
              <Field
                name="description"
                label="Kort beskrivelse"
                placeholder="Dette vises i kalenderen til de inviterte, så gjerne putt zoom-lenka her..."
                component={TextArea.Field}
              />
              <div className={styles.sideBySideBoxes}>
                <Field
                  name="startTime"
                  label="Starttidspunkt"
                  component={DatePicker.Field}
                />
                <Field
                  name="endTime"
                  label="Sluttidspunkt"
                  component={DatePicker.Field}
                />
              </div>
              <Field
                label="Bruk mazemap"
                name="useMazemap"
                component={CheckBox.Field}
                type="checkbox"
              />
              {spyValues((values) => {
                return values?.useMazemap ? (
                  <Flex alignItems="center">
                    <Field
                      label="Mazemap-rom"
                      name="mazemapPoi"
                      component={SelectInput.MazemapAutocomplete}
                      fieldClassName={styles.metaField}
                      placeholder="R1, Abakus, Kjel4"
                    />
                    {values?.mazemapPoi?.value > 0 && (
                      <MazemapLink
                        mazemapPoi={values?.mazemapPoi?.value}
                        linkText="↗️"
                      />
                    )}
                  </Flex>
                ) : (
                  <Field
                    name="location"
                    label="Sted"
                    placeholder="Sted for møte"
                    component={TextInput.Field}
                  />
                );
              })}
              {spyValues((values) => {
                const invitingUsers = values?.users ?? [];

                const possibleReportAuthors = unionBy(
                  [userSearchable],
                  invitedUsersSearchable,
                  invitingUsers,
                  'value'
                );

                return (
                  <Field
                    name="reportAuthor"
                    label="Referent"
                    placeholder="La denne stå åpen for å velge deg selv"
                    options={possibleReportAuthors}
                    component={SelectInput.Field}
                  />
                );
              })}
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
              {isEditPage && (
                <>
                  <h3> Allerede inviterte </h3>
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
                </>
              )}
              {spyFormError((error) => (
                <>{error && <RenderErrorMessage error={error} />}</>
              ))}
              <div>
                {spySubmittable((submittable) => (
                  <Button success={isEditPage} disabled={!submittable} submit>
                    {isEditPage ? 'Lagre endringer' : 'Opprett møte'}
                  </Button>
                ))}
                {isEditPage && canDelete && (
                  <ConfirmModalWithParent
                    title="Slett møte"
                    message="Er du sikker på at du vil slette møtet?"
                    onConfirm={onDeleteMeeting}
                  >
                    <Button danger>Slett møte</Button>
                  </ConfirmModalWithParent>
                )}
              </div>
            </Form>
          );
        }}
      </LegoFinalForm>
    </div>
  );
};

export default MeetingEditor;
