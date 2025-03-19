import { Flex } from '@webkom/lego-bricks';
import moment from 'moment-timezone';
import { useMemo } from 'react';
import Attendance from '~/components/UserAttendance/Attendance';
import RegistrationMeta, {
  RegistrationMetaSkeleton,
} from '~/components/UserAttendance/RegistrationMeta';
import { getWaitingListPosition } from '~/pages/events/@eventIdOrSlug/getWaitingListPosition';
import { getEventSemesterFromStartTime } from '~/pages/events/utils';
import { useAppSelector } from '~/redux/hooks';
import { useIsLoggedIn } from '~/redux/slices/auth';
import { selectRegistrationsFromPools } from '~/redux/slices/events';
import type { UserDetailedEvent } from '~/redux/models/Event';
import type {
  PoolWithRegistrations,
  PoolRegistrationWithUser,
} from '~/redux/slices/events';

// Import necessary components for feedback questions
import { Field } from 'react-final-form';
import { TextInput, CheckBox, RadioButton } from '~/components/Form';
import styles from './AttendeeSection.module.css';

// Add new component for rendering feedback questions
const FeedbackQuestionField = ({ question, name }) => {
  switch (question.type) {
    case 'text':
      return (
        <Field
          name={`${name}.${question.id}`}
          label={question.text}
          required={question.required}
          component={TextInput.Field}
          placeholder="Ditt svar..."
        />
      );
      
    case 'checkboxes':
      return (
        <div className={styles.feedbackQuestionContainer}>
          <label className={styles.feedbackQuestionLabel}>
            {question.text} {question.required && <span className={styles.requiredMark}>*</span>}
          </label>
          <div className={styles.checkboxGroup}>
            {question.options.map((option, i) => (
              <Field
                key={i}
                name={`${name}.${question.id}.${i}`}
                component={CheckBox.Field}
                label={option}
              />
            ))}
          </div>
        </div>
      );
      
    case 'radio':
      return (
        <div className={styles.feedbackQuestionContainer}>
          <label className={styles.feedbackQuestionLabel}>
            {question.text} {question.required && <span className={styles.requiredMark}>*</span>}
          </label>
          <div className={styles.radioGroup}>
            {question.options.map((option, i) => (
              <Field
                key={i}
                name={`${name}.${question.id}`}
                component={RadioButton.Field}
                value={option}
                label={option}
              />
            ))}
          </div>
        </div>
      );
      
    default:
      return null;
  }
};

const MIN_USER_GRID_ROWS = 2;
const MAX_USER_GRID_ROWS = 2;

interface Props {
  showSkeleton: boolean;
  event?: UserDetailedEvent;
  currentRegistration?: PoolRegistrationWithUser;
  pools: PoolWithRegistrations[];
  currentPool?: PoolWithRegistrations;
  fiveMinutesBeforeActivation: boolean;
}

export const AttendeeSection = ({
  showSkeleton,
  event,
  currentRegistration,
  pools,
  currentPool,
  fiveMinutesBeforeActivation,
}: Props) => {
  const loggedIn = useIsLoggedIn();
  const fetching = useAppSelector((state) => state.events.fetching);
  const registrations = useAppSelector((state) =>
    selectRegistrationsFromPools(state, event?.id),
  );

  const currentMoment = moment();
  const waitingListPosition = useMemo(
    () => getWaitingListPosition(currentRegistration, currentPool, pools),
    [currentRegistration, currentPool, pools],
  );

  // The UserGrid is expanded when there's less than 5 minutes till activation
  const minUserGridRows =
    event && fiveMinutesBeforeActivation ? MIN_USER_GRID_ROWS : 0;
    
  // Parse feedback questions from event
  const feedbackQuestions = event?.feedbackQuestionsList 
    ? JSON.parse(event.feedbackQuestionsList) 
    : [];

  return (
    <Flex column>
      <h3>Påmeldte</h3>

      <Attendance
        pools={pools}
        registrations={registrations}
        currentRegistration={currentRegistration}
        minUserGridRows={minUserGridRows}
        maxUserGridRows={MAX_USER_GRID_ROWS}
        legacyRegistrationCount={event?.legacyRegistrationCount}
        skeleton={fetching && !registrations.length}
      />

      {loggedIn &&
        (showSkeleton || !event ? (
          <RegistrationMetaSkeleton />
        ) : (
          <>
            <RegistrationMeta
              useConsent={event.useConsent}
              fiveMinutesBeforeActivation={fiveMinutesBeforeActivation}
              photoConsents={event.photoConsents}
              eventSemester={getEventSemesterFromStartTime(event.startTime)}
              hasEnded={moment(event.endTime).isBefore(currentMoment)}
              registration={currentRegistration}
              isPriced={event.isPriced}
              waitingListPosition={waitingListPosition}
            />
            
            {/* Render feedback questions section */}
            {event.hasFeedbackQuestion && feedbackQuestions.length > 0 && (
              <div className={styles.feedbackQuestionsSection}>
                <h3>{event.feedbackDescription || 'Påmeldingsspørsmål'}</h3>
                {feedbackQuestions.map((question, index) => (
                  <FeedbackQuestionField 
                    key={index}
                    question={{ ...question, id: index }}
                    name="feedbackAnswers"
                  />
                ))}
              </div>
            )}
          </>
        ))}
    </Flex>
  );
};
