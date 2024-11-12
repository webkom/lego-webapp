import { CircleHelp } from 'lucide-react';
import moment from 'moment-timezone';
import { Link } from 'react-router-dom';
import TextWithIcon from 'app/components/TextWithIcon';
import { FormatTime } from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import { useCurrentUser } from 'app/reducers/auth';
import { resolveGroupLink } from 'app/reducers/groups';
import { selectPenaltyByUserId } from 'app/reducers/penalties';
import {
  penaltyHours,
  registrationCloseTime,
  unregistrationCloseTime,
} from 'app/routes/events/utils';
import { useAppSelector } from 'app/store/hooks';
import { isNotNullish } from 'app/utils';
import type { DetailedEvent } from 'app/store/models/Event';

export const useDeadlineInfoList = (event?: DetailedEvent) => {
  const currentUser = useCurrentUser();
  const penalties = useAppSelector((state) =>
    selectPenaltyByUserId(state, currentUser?.id),
  );
  if (!event) {
    return [];
  }

  const currentMoment = moment();

  const activationTimeMoment = moment(event.activationTime);

  // Get the actual activation time.
  // The time from LEGO is with penalties applied.
  // This "unapplies" the penalties again
  const eventRegistrationTime = event.heedPenalties
    ? activationTimeMoment.subtract(penaltyHours(penalties), 'hours')
    : activationTimeMoment;

  const registrationCloseTimeMoment = registrationCloseTime(event);
  const unregistrationCloseTimeMoment = unregistrationCloseTime(event);
  const sameRegistrationAndUnregistration =
    event.registrationDeadlineHours === event.unregistrationDeadlineHours;

  return [
    event.activationTime && currentMoment.isBefore(activationTimeMoment)
      ? {
          key: 'Påmelding åpner',
          value: (
            <FormatTime
              format="dd DD. MMM HH:mm"
              time={eventRegistrationTime}
            />
          ),
        }
      : null,
    event.heedPenalties &&
    event.unregistrationDeadline &&
    !['OPEN', 'TBA'].includes(event.eventStatusType)
      ? {
          key: 'Frist for prikk',
          keyNode: (
            <TextWithIcon
              iconNode={<CircleHelp />}
              content="Frist for prikk"
              tooltipContent={
                <>
                  Lurer du på hvordan prikksystemet fungerer? Sjekk ut{' '}
                  <Link to="/pages/arrangementer/26-arrangementsregler">
                    arrangementsreglene
                  </Link>
                  .
                </>
              }
              iconRight
              size={14}
            />
          ),
          value: (
            <FormatTime
              format="dd DD. MMM HH:mm"
              time={event.unregistrationDeadline}
            />
          ),
        }
      : null,
    activationTimeMoment.isBefore(currentMoment) &&
    sameRegistrationAndUnregistration
      ? {
          key: 'Frist for av/påmelding',
          keyNode: (
            <TextWithIcon
              iconNode={<CircleHelp />}
              content={
                currentMoment.isBefore(registrationCloseTimeMoment)
                  ? 'Påmelding stenger'
                  : 'Påmelding stengte'
              }
              tooltipContent={
                <>
                  Etter påmeldingen stenger er det hverken mulig å melde seg på
                  eller av arrangementet
                </>
              }
              iconRight
              size={14}
            />
          ),
          value: (
            <FormatTime
              format="dd DD. MMM HH:mm"
              time={registrationCloseTimeMoment}
            />
          ),
        }
      : null,
    activationTimeMoment.isBefore(currentMoment) &&
    !sameRegistrationAndUnregistration
      ? {
          key: 'Frist for påmelding',
          keyNode: (
            <TextWithIcon
              iconNode={<CircleHelp />}
              content={
                currentMoment.isBefore(registrationCloseTimeMoment)
                  ? 'Påmelding stenger'
                  : 'Påmelding stengte'
              }
              tooltipContent={
                <>
                  Etter påmeldingen stenger er det ikke mulig å melde seg på
                  arrangementet
                </>
              }
              iconRight
              size={14}
            />
          ),
          value: (
            <FormatTime
              format="dd DD. MMM HH:mm"
              time={registrationCloseTimeMoment}
            />
          ),
        }
      : null,
    activationTimeMoment.isBefore(currentMoment) &&
    !sameRegistrationAndUnregistration
      ? {
          key: 'Frist for avmelding',
          keyNode: (
            <TextWithIcon
              iconNode={<CircleHelp />}
              content={
                currentMoment.isBefore(unregistrationCloseTimeMoment)
                  ? 'Avmelding stenger'
                  : 'Avmelding stengte'
              }
              tooltipContent={
                <>
                  Etter avmeldingen stenger er det ikke mulig å melde seg av
                  arrangementet
                </>
              }
              iconRight
              size={14}
            />
          ),
          value: (
            <FormatTime
              format="dd DD. MMM HH:mm"
              time={unregistrationCloseTimeMoment}
            />
          ),
        }
      : null,
    event.paymentDueDate
      ? {
          key: 'Betalingsfrist',
          value: (
            <FormatTime format="dd DD. MMM HH:mm" time={event.paymentDueDate} />
          ),
        }
      : null,
  ].filter(isNotNullish);
};

export const useEventCreatorInfoList = (event?: DetailedEvent) => {
  if (!event) {
    return [];
  }

  const groupLink =
    event.responsibleGroup && resolveGroupLink(event.responsibleGroup);

  const responsibleGroupName = groupLink ? (
    <Link to={groupLink}>{event.responsibleGroup?.name}</Link>
  ) : (
    event.responsibleGroup?.name
  );

  return [
    // Responsible group
    event.responsibleGroup && {
      key: 'Arrangør',
      value: event.responsibleGroup.contactEmail ? (
        <Tooltip
          content={
            <span>
              {event.responsibleGroup.contactEmail && (
                <a href={`mailto:${event.responsibleGroup.contactEmail}`}>
                  {event.responsibleGroup.contactEmail}
                </a>
              )}
            </span>
          }
        >
          {responsibleGroupName}
        </Tooltip>
      ) : (
        responsibleGroupName
      ),
    },
    // Responsible users, author or anonymous
    ...(event.responsibleUsers && event.responsibleUsers.length > 0
      ? [
          {
            key:
              event.responsibleUsers.length > 1
                ? 'Kontaktpersoner'
                : 'Kontaktperson',
            value: (
              <ul>
                {event.responsibleUsers.map((user) => (
                  <li key={user.id}>
                    <Link to={`/users/${user.username}`} key={user.username}>
                      {user.fullName}
                    </Link>
                  </li>
                ))}
              </ul>
            ),
          },
        ]
      : event.createdBy
        ? [
            {
              key: 'Forfatter',
              value: (
                <Link to={`/users/${event.createdBy.username}`}>
                  {event.createdBy.fullName}
                </Link>
              ),
            },
          ]
        : [
            {
              key: 'Forfatter',
              value: 'Anonym',
            },
          ]),
  ].filter(isNotNullish);
};
