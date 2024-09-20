import {
  ButtonGroup,
  LinkButton,
  LoadingPage,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import arrayMutators from 'final-form-arrays';
import moment from 'moment-timezone';
import { useEffect } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { createEvent, editEvent, fetchEvent } from 'app/actions/EventActions';
import {
  fetchImageGallery,
  setSaveForUse,
  uploadFile as _uploadFile,
} from 'app/actions/FileActions';
import { CheckBox, Form, LegoFinalForm } from 'app/components/Form';
import { SubmitButton } from 'app/components/Form/SubmitButton';
import {
  selectEventByIdOrSlug,
  selectPoolsWithRegistrationsForEvent,
} from 'app/reducers/events';
import { transformEvent } from 'app/routes/events/components/EventEditor/utils';
import {
  displayNameForEventType,
  transformEventStatusType,
} from 'app/routes/events/utils';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { EventStatusType } from 'app/store/models/Event';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import time from 'app/utils/time';
import {
  conditionalValidation,
  createValidator,
  isInteger,
  legoEditorRequired,
  maxSize,
  mergeTimeAfterAllPoolsActivation,
  minSize,
  required,
  requiredIf,
  timeIsAfter,
  timeIsAtLeastDurationAfter,
  validYoutubeUrl,
} from 'app/utils/validation';
import Admin from '../Admin';
import EditorSection, {
  Descriptions,
  Details,
  Header,
  Registration,
} from './EditorSection';
import styles from './EventEditor.css';
import type { EntityId } from '@reduxjs/toolkit';
import type { UploadArgs } from 'app/actions/FileActions';
import type { ActionGrant } from 'app/models';
import type { PoolRegistrationWithUser } from 'app/reducers/events';
import type { AdministrateEvent, EventType } from 'app/store/models/Event';
import type { DetailedUser } from 'app/store/models/User';

export type EventEditorFormValues = {
  id?: EntityId;
  slug?: string;
  title: string;
  startTime: string;
  endTime: string;
  description: string;
  text: string;
  eventType: {
    label: string;
    value: EventType;
  };
  eventStatusType: {
    label: string;
    value: EventStatusType;
  };
  company?: {
    label: string;
    value: EntityId;
  };
  responsibleGroup?: {
    label: string;
    value: EntityId;
  };
  location: string;
  isPriced: boolean;
  useStripe: boolean;
  priceMember: number;
  paymentDueDate?: string;
  mergeTime: string;
  useCaptcha: boolean;
  youtubeUrl: string;
  heedPenalties: boolean;
  isGroupOnly: boolean;
  canViewGroups: {
    label: string;
    value: EntityId;
    id: EntityId;
  }[];
  useConsent: boolean;
  feedbackDescription: string;
  pools: {
    id?: EntityId;
    name: string;
    registrations: PoolRegistrationWithUser[];
    capacity?: number;
    permissionGroups: {
      label: string;
      value: EntityId;
    }[];
    activationDate: string;
  }[];
  useMazemap: boolean;
  mazemapPoi?: {
    label: string;
    value: number;
  };
  separateDeadlines: boolean;
  registrationDeadlineHours: number;
  unregistrationDeadline?: string;
  unregistrationDeadlineHours: number;
  responsibleUsers: {
    label: string;
    value: EntityId;
  }[];
  isForeignLanguage: boolean;
  cover: string;
  saveToImageGallery?: boolean;
  hasFeedbackQuestion: boolean;
  feedbackRequired: boolean;
  isClarified: boolean;
};

const TypedLegoForm = LegoFinalForm<EventEditorFormValues>;

const validate = createValidator({
  youtubeUrl: [validYoutubeUrl()],
  title: [required('Tittel er påkrevd')],
  description: [required('Kalenderbeskrivelse er påkrevd')],
  text: [legoEditorRequired('Innhold er påkrevd')],
  eventType: [required('Arrangementstype er påkrevd')],
  location: [
    requiredIf((allValues) => !allValues.useMazemap, 'Sted er påkrevd'),
  ],
  mazemapPoi: [
    requiredIf((allValues) => allValues.useMazemap, 'Sted er påkrevd'),
  ],
  cover: [required('Cover er påkrevd')],
  eventStatusType: [required('Påmeldingstype er påkrevd')],
  priceMember: [
    requiredIf((allValues) => allValues.isPriced, 'Pris er påkrevd'),
    conditionalValidation(
      (allValues) => allValues.isPriced,
      () => [
        minSize(0, 'Prisen må være større enn 0'),
        maxSize(10000, 'Prisen kan ikke være større enn 10000'),
      ],
    ),
  ],
  paymentDueDate: [
    timeIsAtLeastDurationAfter(
      'unregistrationDeadline',
      moment.duration(1, 'day'),
      'Betalingsfristen må være minst 24 timer etter avregistreringsfristen',
    ),
  ],
  isClarified: [
    required('Arrangementet må være avklart i arrangementskalenderen'),
  ],
  feedbackDescription: [
    requiredIf(
      (allValues) => allValues.hasFeedbackQuestion,
      'Spørsmål er påkrevd',
    ),
  ],
  registrationDeadlineHours: [isInteger('Kun hele timer')],
  unregistrationDeadlineHours: [isInteger('Kun hele timer')],
  endTime: [
    timeIsAfter('startTime', 'Sluttidspunkt kan ikke være før starttidspunkt'),
  ],
  mergeTime: [
    conditionalValidation(
      (allValues) => allValues.pools.length > 1,
      () => [
        mergeTimeAfterAllPoolsActivation(
          'Sammenslåingstidspunkt satt før aktiveringspunkt i en av poolene',
        ),
      ],
    ),
  ],
});

const EventEditor = () => {
  const params = useParams<{
    eventIdOrSlug: string;
  }>() as {
    eventIdOrSlug: string;
  };
  const isEditPage = params.eventIdOrSlug !== undefined;
  const { state } = useLocation();
  // Fallback to a potential event id, e.g. given from the admin "copy event" button
  const eventIdOrSlug = params.eventIdOrSlug ?? state?.id;

  const fetching = useAppSelector((state) => state.events.fetching);
  const event = useAppSelector((state) =>
    selectEventByIdOrSlug(state, eventIdOrSlug),
  ) as AdministrateEvent;
  const eventId = event?.id;
  const actionGrant: ActionGrant = event?.actionGrant || [];
  const pools = useAppSelector((state) =>
    selectPoolsWithRegistrationsForEvent(state, eventId),
  );

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchEventEdit',
    () =>
      Promise.allSettled([
        eventIdOrSlug && dispatch(fetchEvent(eventIdOrSlug)),
        dispatch(fetchImageGallery()),
      ]),
    [eventIdOrSlug],
  );

  const uploadFile = ({
    file,
    fileName,
    isPublic = false,
    timeout,
  }: UploadArgs) => {
    dispatch(_uploadFile({ file, fileName, isPublic, timeout }));
  };

  const navigate = useNavigate();
  useEffect(() => {
    if (isEditPage && event?.slug && event?.slug !== eventIdOrSlug) {
      navigate(`/events/${event.slug}/edit`, { replace: true });
    }
  }, [event?.slug, navigate, eventIdOrSlug, isEditPage]);

  if (isEditPage && (!event || !event.title)) {
    return <LoadingPage loading={fetching} />;
  }

  if (isEditPage && !actionGrant.includes('edit')) {
    return null;
  }

  const onSubmit = (values: EventEditorFormValues) => {
    (isEditPage
      ? dispatch(editEvent(transformEvent(values)))
      : dispatch(createEvent(transformEvent(values)))
    ).then((res) => {
      const key: string = values.cover.split(':')[0];
      const token: string = values.cover.split(':')[1];
      if (values.saveToImageGallery) {
        dispatch(setSaveForUse(key, token, true));
      }
      navigate(
        isEditPage
          ? `/events/${eventIdOrSlug}`
          : `/events/${res.payload.result}`,
      );
    });
  };

  const initialValues: Partial<EventEditorFormValues> = event
    ? {
        ...event,
        startTime: moment(event.startTime).toISOString(),
        endTime: moment(event.endTime).toISOString(),
        mergeTime: event.mergeTime
          ? moment(event.mergeTime).toISOString()
          : time({
              hours: 12,
            }),
        paymentDueDate:
          event.paymentDueDate && moment(event.paymentDueDate).toISOString(),
        priceMember: event.priceMember / 100,
        pools: pools.map((pool) => ({
          ...pool,
          permissionGroups: (pool.permissionGroups || []).map((group) => ({
            label: group.name,
            value: group.id,
          })),
          activationDate: moment(pool.activationDate).toISOString(),
        })),
        canViewGroups: (event.canViewGroups || []).map((group) => ({
          label: group.name,
          value: group.id,
          id: group.id,
        })),
        isGroupOnly: event.canViewGroups?.length > 0,
        company: event.company && {
          label: event.company.name,
          value: event.company.id,
        },
        responsibleGroup: event.responsibleGroup && {
          label: event.responsibleGroup.name,
          value: event.responsibleGroup.id,
        },
        responsibleUsers:
          event.responsibleUsers &&
          event.responsibleUsers.map((user: DetailedUser) => ({
            label: user.fullName,
            value: user.id,
          })),
        isForeignLanguage: event.isForeignLanguage,
        eventType: event.eventType && {
          label: displayNameForEventType(event.eventType),
          value: event.eventType,
        },
        eventStatusType:
          event.eventStatusType &&
          transformEventStatusType(event.eventStatusType),
        location: event.location,
        useMazemap:
          (event.mazemapPoi && event.mazemapPoi > 0) || !event.location,
        mazemapPoi: event.mazemapPoi
          ? {
              label: event.location,
              //if mazemapPoi has a value, location will be its display name
              value: event.mazemapPoi,
            }
          : undefined,
        separateDeadlines:
          event.registrationDeadlineHours !== event.unregistrationDeadlineHours,
        unregistrationDeadline:
          event.unregistrationDeadline &&
          moment(event.unregistrationDeadline).toISOString(),
        hasFeedbackQuestion: !!event.feedbackDescription,
        isClarified: true,
      }
    : {
        title: '',
        startTime: time({
          hours: 17,
          minutes: 15,
        }),
        endTime: time({
          hours: 20,
          minutes: 15,
        }),
        description: '',
        text: '',
        eventStatusType: transformEventStatusType(EventStatusType.TBA),
        company: undefined,
        responsibleGroup: undefined,
        location: 'TBA',
        isPriced: false,
        useStripe: true,
        priceMember: 0,
        paymentDueDate: time({
          days: 7,
          hours: 17,
          minutes: 15,
        }),
        mergeTime: time({
          hours: 12,
        }),
        useCaptcha: true,
        heedPenalties: true,
        isGroupOnly: false,
        canViewGroups: [],
        useConsent: false,
        feedbackDescription: '',
        feedbackRequired: false,
        pools: [],
        useMazemap: false,
        separateDeadlines: false,
        unregistrationDeadline: time({
          hours: 12,
        }),
        registrationDeadlineHours: 2,
        unregistrationDeadlineHours: 2,
        responsibleUsers: [],
        isForeignLanguage: false,
        isClarified: false,
      };

  const title = isEditPage ? `Redigerer: ${event.title}` : 'Nytt arrangement';

  return (
    <Page
      title={title}
      skeleton={fetching}
      back={{
        href: isEditPage ? `/events/${event?.slug}` : '/events',
      }}
    >
      <Helmet title={title} />

      <TypedLegoForm
        onSubmit={onSubmit}
        initialValues={initialValues}
        validate={validate}
        mutators={{
          ...arrayMutators,
        }}
      >
        {({ handleSubmit, values }) => (
          <Form onSubmit={handleSubmit}>
            <EditorSection
              title="Tittel og cover"
              initiallyExpanded={!isEditPage}
            >
              <Header values={values} />
            </EditorSection>

            <EditorSection title="Detaljer" initiallyExpanded={!isEditPage}>
              <Details values={values} />
            </EditorSection>

            <EditorSection title="Påmelding" initiallyExpanded={!isEditPage}>
              <Registration values={values} />
            </EditorSection>

            <EditorSection title="Beskrivelse" collapsible={false}>
              <Descriptions uploadFile={uploadFile} />
            </EditorSection>

            {!isEditPage && (
              <Field
                label={
                  <>
                    Arrangementet er avklart i{' '}
                    <Link to="/pages/arrangementer/86-arrangementskalender">
                      arrangementskalenderen
                    </Link>
                  </>
                }
                description={
                  <>
                    Jeg er kjent med at jeg kun kan bruke rettighetene mine til
                    å opprette et Abakusarrangement som er i tråd med{' '}
                    <Link
                      style={{ display: 'contents' }}
                      to="/pages/arrangementer/86-arrangementskalender"
                    >
                      arrangementskalenderen
                    </Link>{' '}
                    og Abakus sine blesteregler, og at jeg må ta kontakt med{' '}
                    <a
                      style={{ display: 'contents' }}
                      href="mailto:hs@abakus.no"
                    >
                      hs@abakus.no
                    </a>{' '}
                    dersom jeg er usikker eller ønsker å opprette et
                    annet/eksternt arrangement.
                  </>
                }
                name="isClarified"
                type="checkbox"
                component={CheckBox.Field}
                fieldClassName={styles.metaFieldInformation}
                className={styles.formField}
                required
              />
            )}

            <ButtonGroup>
              {isEditPage && (
                <LinkButton flat href={`/events/${eventIdOrSlug}`}>
                  Avbryt
                </LinkButton>
              )}
              <SubmitButton>
                {isEditPage ? 'Lagre endringer' : 'Opprett'}
              </SubmitButton>
            </ButtonGroup>

            {isEditPage && (
              <Admin
                actionGrant={actionGrant}
                event={{ ...values, id: values.id!, slug: values.slug! }}
              />
            )}
          </Form>
        )}
      </TypedLegoForm>
    </Page>
  );
};

export default guardLogin(EventEditor);
