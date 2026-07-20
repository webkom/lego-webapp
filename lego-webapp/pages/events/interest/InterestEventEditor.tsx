import { ButtonGroup, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { navigate } from 'vike/client/router';
import { GroupType } from 'app/models';
import {
  Button,
  CheckBox,
  DatePicker,
  EditorField,
  Form,
  SelectInput,
  TextEditor,
  TextInput,
} from '~/components/Form';
import LegoFinalForm from '~/components/Form/LegoFinalForm';
import SubmissionError from '~/components/Form/SubmissionError';
import { SubmitButton } from '~/components/Form/SubmitButton';
import { mazemapDeps } from '~/components/MazemapEmbed';
import useIsInterestGroupLeader, {
  LEADER_ROLES,
} from '~/pages/events/interest/useIsInterestGroupLeader';
import { EventTypeConfig, transformEvent } from '~/pages/events/utils';
import { createEvent } from '~/redux/actions/EventActions';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventType } from '~/redux/models/Event';
import { selectGroupsByType } from '~/redux/slices/groups';
import { spyValues } from '~/utils/formSpyUtils';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import time from '~/utils/time';
import {
  createValidator,
  datesAreInCorrectOrder,
  dateRequired,
  ifField,
  ifNotField,
  legoEditorRequired,
  required,
} from '~/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish, TransformEvent } from 'app/models';
import type { PublicListGroup } from '~/redux/models/Group';

type InterestEventFormValues = {
  title?: string;
  description?: string;
  text?: string;
  eventType: { value: EventType; label: string };
  responsibleGroup?: { label: string; value: EntityId };
  responsibleUsers: [];
  date: [Dateish, Dateish];
  useMazemap: boolean;
  mazemapPoi?: { label: string; value: number };
  location?: string;
  pools: { capacity?: number | string }[];
  isGroupOnly: boolean;
  canViewGroups: [];
  isPriced: boolean;
};

const validate = createValidator({
  title: [required('Du må gi arrangementet en tittel')],
  description: [required('Du må skrive en kalenderbeskrivelse')],
  text: [legoEditorRequired('Du må skrive en hovedbeskrivelse')],
  responsibleGroup: [required('Du må velge en ansvarlig interessegruppe')],
  date: [
    dateRequired('Du må velge start- og sluttdato'),
    datesAreInCorrectOrder('Sluttidspunkt kan ikke være før starttidspunkt'),
  ],
  location: [
    ifNotField('useMazemap', required('Sted eller MazeMap-rom er påkrevd')),
  ],
  mazemapPoi: [
    ifField('useMazemap', required('Sted eller MazeMap-rom er påkrevd')),
  ],
});

const TypedLegoForm = LegoFinalForm<InterestEventFormValues>;

const InterestEventEditor = () => {
  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchInterestEventEditorGroups',
    () => dispatch(fetchAllWithType(GroupType.Interest)),
    [],
  );

  const isInterestGroupLeader = useIsInterestGroupLeader();
  const actionGrant = useAppSelector((state) => state.events.actionGrant);
  const fetching = useAppSelector((state) => state.groups.fetching);
  const interestGroups = useAppSelector((state) =>
    selectGroupsByType<PublicListGroup>(state, GroupType.Interest),
  );

  const canCreateForAll = actionGrant.includes('create');
  const allowed = isInterestGroupLeader || canCreateForAll;

  useEffect(() => {
    if (!fetching && !allowed) {
      navigate('/events/interest');
    }
  }, [fetching, allowed]);

  if (!allowed) {
    return <LoadingPage loading />;
  }

  const activeGroups = interestGroups.filter((group) => group.active);
  const groupOptions = (
    canCreateForAll
      ? activeGroups
      : activeGroups.filter(
          (group) =>
            group.userMembership &&
            LEADER_ROLES.includes(group.userMembership.role),
        )
  ).map((group) => ({ label: group.name, value: group.id }));

  const initialValues: Partial<InterestEventFormValues> = {
    eventType: {
      value: EventType.INTEREST_EVENT,
      label: EventTypeConfig[EventType.INTEREST_EVENT].displayName,
    },
    responsibleGroup: groupOptions.length === 1 ? groupOptions[0] : undefined,
    date: [time({ hours: 17, minutes: 15 }), time({ hours: 20, minutes: 15 })],
    pools: [{}],
    useMazemap: false,
    isGroupOnly: false,
    canViewGroups: [],
    isPriced: false,
    responsibleUsers: [],
  };

  const onSubmit = (values: InterestEventFormValues) =>
    dispatch(
      createEvent(transformEvent(values as unknown as TransformEvent)),
    ).then((res) => navigate(`/events/${res.payload.result}`));

  return (
    <Page
      title="Nytt interessearrangement"
      back={{ label: 'Interessegrupper', href: '/events/interest' }}
    >
      <Helmet title="Nytt interessearrangement">{mazemapDeps}</Helmet>
      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Field
              name="title"
              label="Tittel"
              placeholder="Klatrekveld"
              component={TextInput.Field}
              required
            />
            <Field
              name="description"
              label="Kalenderbeskrivelse"
              description="Kort tekst som vises i arrangementslisten og kalenderen."
              placeholder="Bli med på ..."
              component={TextEditor.Field}
              required
            />
            <Field
              name="text"
              label="Hovedbeskrivelse"
              component={EditorField.Field}
              required
            />
            <Field
              name="responsibleGroup"
              label="Ansvarlig interessegruppe"
              placeholder="Velg interessegruppe"
              options={groupOptions}
              component={SelectInput.Field}
              required
            />
            <Field
              name="date"
              label="Dato"
              range
              component={DatePicker.Field}
              required
            />
            <Field
              name="useMazemap"
              label="Bruk MazeMap"
              type="checkbox"
              component={CheckBox.Field}
            />
            {spyValues<InterestEventFormValues>((values) =>
              values?.useMazemap ? (
                <Field
                  name="mazemapPoi"
                  label="MazeMap-rom"
                  placeholder="R1, Abakus, Kjel4"
                  component={SelectInput.MazemapAutocomplete}
                  required
                />
              ) : (
                <Field
                  name="location"
                  label="Sted"
                  placeholder="Sted for arrangementet"
                  component={TextInput.Field}
                  required
                />
              ),
            )}
            <Field
              name="pools[0].capacity"
              label="Kapasitet (0 = ubegrenset)"
              description="Interessearrangementer er åpne for alle i Abakus fra de opprettes og frem til arrangementsstart"
              type="number"
              component={TextInput.Field}
            />
            <SubmissionError />
            <ButtonGroup>
              <Button flat onPress={() => navigate('/events/interest')}>
                Avbryt
              </Button>
              <SubmitButton>Opprett</SubmitButton>
            </ButtonGroup>
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(InterestEventEditor);
