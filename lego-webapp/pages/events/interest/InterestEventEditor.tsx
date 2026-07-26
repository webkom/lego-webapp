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
import InterestCapacityField from '~/pages/events/interest/InterestCapacityField';
import useIsInterestGroupLeader, {
  LEADER_ROLES,
} from '~/pages/events/interest/useIsInterestGroupLeader';
import { EventTypeConfig, transformEvent } from '~/pages/events/utils';
import {
  createEvent,
  editEvent,
  fetchEvent,
  fetchEvents,
} from '~/redux/actions/EventActions';
import { fetchAllWithType } from '~/redux/actions/GroupActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { EventType } from '~/redux/models/Event';
import {
  selectEventByIdOrSlug,
  selectPoolsForEvent,
} from '~/redux/slices/events';
import { selectGroupsByType } from '~/redux/slices/groups';
import { EDITOR_EMPTY } from '~/utils/constants';
import { spyValues } from '~/utils/formSpyUtils';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import time from '~/utils/time';
import { useParams } from '~/utils/useParams';
import {
  createValidator,
  datesAreInCorrectOrder,
  dateRequired,
  ifField,
  ifNotField,
  required,
} from '~/utils/validation';
import type { EntityId } from '@reduxjs/toolkit';
import type { Dateish, TransformEvent } from 'app/models';
import type { UserDetailedEvent } from '~/redux/models/Event';
import type { PublicListGroup } from '~/redux/models/Group';

type InterestEventFormValues = {
  id?: EntityId;
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
  pools: { id?: EntityId; capacity?: number | string }[];
  isGroupOnly: boolean;
  canViewGroups: [];
  isPriced: boolean;
};

const validate = createValidator({
  title: [required('Du må gi arrangementet en tittel')],
  description: [required('Du må skrive en kort beskrivelse')],
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
  const { eventIdOrSlug } = useParams<{ eventIdOrSlug?: string }>();
  const isEditPage = eventIdOrSlug !== undefined;
  const event = useAppSelector((state) =>
    selectEventByIdOrSlug(state, eventIdOrSlug),
  ) as UserDetailedEvent | undefined;
  const eventPools = useAppSelector((state) =>
    selectPoolsForEvent(state, event?.id),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchInterestEventEditorGroups',
    () => dispatch(fetchAllWithType(GroupType.Interest)),
    [],
  );

  usePreparedEffect(
    'fetchInterestEventEdit',
    () => (eventIdOrSlug ? dispatch(fetchEvent(eventIdOrSlug)) : undefined),
    [eventIdOrSlug],
  );

  // The create grant rides on the events list response, so keyword admins
  // navigating straight here would be bounced without this fetch
  usePreparedEffect(
    'fetchInterestEventEditorGrants',
    () =>
      isEditPage
        ? Promise.resolve()
        : dispatch(fetchEvents({ query: { page_size: 1 } })),
    [isEditPage],
  );

  const isInterestGroupLeader = useIsInterestGroupLeader();
  const actionGrant = useAppSelector((state) => state.events.actionGrant);
  const fetching = useAppSelector((state) => state.groups.fetching);
  const eventsFetching = useAppSelector((state) => state.events.fetching);
  const interestGroups = useAppSelector((state) =>
    selectGroupsByType<PublicListGroup>(state, GroupType.Interest),
  );

  const canCreateForAll = actionGrant.includes('create');
  const allowed = isEditPage
    ? !!event &&
      event.eventType === EventType.INTEREST_EVENT &&
      (event.actionGrant ?? []).includes('edit')
    : isInterestGroupLeader || canCreateForAll;

  useEffect(() => {
    if (isEditPage) {
      if (event && !allowed) {
        navigate(`/events/${eventIdOrSlug}`);
      } else if (!event && !eventsFetching) {
        // The fetch settled without an event - bad id or no view access
        navigate('/events/interest');
      }
    } else if (!fetching && !eventsFetching && !allowed) {
      navigate('/events/interest');
    }
  }, [isEditPage, event, eventIdOrSlug, fetching, eventsFetching, allowed]);

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

  const eventTypeOption = {
    value: EventType.INTEREST_EVENT,
    label: EventTypeConfig[EventType.INTEREST_EVENT].displayName,
  };
  const sharedValues = {
    isGroupOnly: false,
    canViewGroups: [] as [],
    isPriced: false,
    responsibleUsers: [] as [],
  };
  const initialValues: Partial<InterestEventFormValues> =
    isEditPage && event
      ? {
          ...sharedValues,
          id: event.id,
          eventType: eventTypeOption,
          title: event.title,
          description: event.description,
          text: event.text,
          date: [event.startTime, event.endTime],
          useMazemap: !!event.mazemapPoi && event.mazemapPoi > 0,
          mazemapPoi: event.mazemapPoi
            ? { label: event.location, value: event.mazemapPoi }
            : undefined,
          location: event.location,
          responsibleGroup: event.responsibleGroup && {
            label: event.responsibleGroup.name,
            value: event.responsibleGroup.id,
          },
          pools: eventPools.length
            ? [{ id: eventPools[0].id, capacity: eventPools[0].capacity }]
            : [{}],
        }
      : {
          ...sharedValues,
          eventType: eventTypeOption,
          text: EDITOR_EMPTY,
          responsibleGroup:
            groupOptions.length === 1 ? groupOptions[0] : undefined,
          date: [
            time({ hours: 17, minutes: 15 }),
            time({ hours: 20, minutes: 15 }),
          ],
          pools: [{}],
          useMazemap: false,
        };

  const onSubmit = (values: InterestEventFormValues) => {
    const payload = transformEvent(values as unknown as TransformEvent);
    if (isEditPage) {
      return dispatch(editEvent(payload)).then(() =>
        navigate(`/events/${eventIdOrSlug}`),
      );
    }
    return dispatch(createEvent(payload)).then((res) =>
      navigate(`/events/${res.payload.result}`),
    );
  };

  const pageTitle = isEditPage
    ? `Redigerer: ${event?.title}`
    : 'Nytt interessearrangement';

  return (
    <Page
      title={pageTitle}
      back={
        isEditPage
          ? { label: 'Tilbake', href: `/events/${eventIdOrSlug}` }
          : { label: 'Interessegrupper', href: '/events/interest' }
      }
    >
      <Helmet title={pageTitle}>{mazemapDeps}</Helmet>
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
              label="Kort beskrivelse"
              description="Kort og fengende tekst som vises under arrangementet i agendaen"
              placeholder="Bli med Abarun på ukas løpetur langs Nidelva - rolig tempo, god stemning og boller etterpå!"
              component={TextEditor.Field}
              required
            />
            <Field
              name="text"
              label="Hovedbeskrivelse"
              description="Vises på selve arrangementssiden. Kan være den samme som korte beskrivelsen"
              component={EditorField.Field}
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
            <InterestCapacityField />
            <SubmissionError />
            <ButtonGroup>
              <Button
                flat
                onPress={() =>
                  navigate(
                    isEditPage
                      ? `/events/${eventIdOrSlug}`
                      : '/events/interest',
                  )
                }
              >
                Avbryt
              </Button>
              <SubmitButton>
                {isEditPage ? 'Lagre endringer' : 'Opprett'}
              </SubmitButton>
            </ButtonGroup>
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(InterestEventEditor);
