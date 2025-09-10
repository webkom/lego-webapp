import { EntityId } from '@reduxjs/toolkit';
import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { MessageCircleIcon, MoveRight } from 'lucide-react';
import { useState } from 'react';
import { Field } from 'react-final-form';
import { Helmet } from 'react-helmet-async';
import {
  ContentSection,
  ContentMain,
  ContentSidebar,
} from '~/components/Content';
import {
  Form,
  LegoFinalForm,
  SubmissionError,
  SubmitButton,
  TextInput,
} from '~/components/Form';
import { ProfilePicture } from '~/components/Image';
import { Tag } from '~/components/Tags';
import Time from '~/components/Time';
import HTTPError from '~/components/errors/HTTPError';
import LendingCalendar from '~/pages/lending/@lendableObjectId/LendingCalendar';
import LendingStatusTag, { statusMap } from '~/pages/lending/LendingStatusTag';
import { useIsCurrentUser } from '~/pages/users/utils';
import {
  fetchLendingRequestById,
  editLendingRequest,
  commentOnLendingRequest,
} from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { UnknownLendableObject } from '~/redux/models/LendableObject';
import {
  LendingRequestStatus,
  DetailLendingRequest,
  AdminLendingRequest,
  TimelineEntry,
} from '~/redux/models/LendingRequest';
import { PublicUserWithGroups } from '~/redux/models/User';
import { selectLendableObjectById } from '~/redux/slices/lendableObjects';
import { selectLendingRequestById } from '~/redux/slices/lendingRequests';
import { selectUserById } from '~/redux/slices/users';
import { useFeatureFlag } from '~/utils/useFeatureFlag';
import { useParams } from '~/utils/useParams';
import useQuery from '~/utils/useQuery';
import styles from './LendingRequestDetail.module.css';

type Params = {
  lendingRequestId: string;
  lendableObjectId: string;
};

const LendingRequest = () => {
  const { query } = useQuery({
    fromAdmin: '',
  });

  const dispatch = useAppDispatch();
  const [fetching, setFetching] = useState(false);

  const { lendingRequestId, lendableObjectId } = useParams<Params>();

  usePreparedEffect(
    'fetchLendingRequestById',
    () =>
      dispatch(fetchLendingRequestById(lendingRequestId!)).then(() =>
        setFetching(false),
      ),
    [lendingRequestId],
  );

  const lendingRequest = useAppSelector((state) =>
    selectLendingRequestById<DetailLendingRequest | AdminLendingRequest>(
      state,
      lendingRequestId!,
    ),
  );

  const lendableObject = useAppSelector((state) =>
    selectLendableObjectById<UnknownLendableObject>(state, lendableObjectId),
  );
  const createdByUser = useAppSelector((state) =>
    selectUserById<PublicUserWithGroups>(state, lendingRequest?.createdBy),
  );
  const isCurrentUser = useIsCurrentUser(createdByUser?.username);

  if (!useFeatureFlag('lending')) {
    return <HTTPError />;
  }

  if (fetching) {
    return <LoadingIndicator loading />;
  }

  const isAdmin = lendingRequest?.actionGrant?.includes('edit');

  const title = `Forespørsel ${lendableObject?.title ? ` - ${lendableObject.title}` : ''}`;

  return (
    <Page
      title={title}
      back={{ href: query.fromAdmin ? '/lending/admin' : '/lending' }}
      skeleton={fetching}
    >
      <Helmet title={title} />
      {lendingRequest && (
        <ContentSection>
          <ContentMain>
            <LendingCalendar
              lendableObjectId={lendableObjectId}
              selectedRange={
                lendingRequest.startDate
                  ? [lendingRequest.startDate, lendingRequest.endDate]
                  : undefined
              }
            />
            <h3>Forespørrende bruker</h3>
            <RequestingUser user={createdByUser} />
            <h3>Periode</h3>
            <Flex alignItems="center" gap={8}>
              <Time time={lendingRequest.startDate} format="ll - HH:mm" />
              <Icon iconNode={<MoveRight />} size={19} />
              <Time time={lendingRequest.endDate} format="ll - HH:mm" />
            </Flex>
            <h3>Kommentar til forespørsel</h3>
            <p>
              {lendingRequest.text || (
                <span className={styles.noComment}>Ingen kommentar</span>
              )}
            </p>
            <h3>Tidslinje</h3>
            <Flex column>
              {lendingRequest.timelineEntries?.map(
                (entry: TimelineEntry, index) => (
                  <TimeLineEntry
                    entry={entry}
                    key={entry.id}
                    isFirst={index === 0}
                    isLast={index === lendingRequest.timelineEntries.length - 1}
                  />
                ),
              )}
            </Flex>
            <h3>Kommenter</h3>
            <CommentForm lendingRequestId={lendingRequest.id} />
          </ContentMain>
          <ContentSidebar>
            <h3>Status</h3>
            <LendingStatusTag lendingRequestStatus={lendingRequest.status} />
            {isCurrentUser && (
              <Flex
                column
                gap="var(--spacing-sm)"
                className={styles.buttonWrapper}
              >
                {lendingRequest.status ==
                  LendingRequestStatus.ChangesRequested && (
                  <UpdateButton
                    toStatus={LendingRequestStatus.ChangesResolved}
                    lendingRequest={lendingRequest}
                  />
                )}
                <UpdateButton
                  toStatus={LendingRequestStatus.Cancelled}
                  lendingRequest={lendingRequest}
                />
              </Flex>
            )}
            {isAdmin && (
              <>
                <h3>Admin</h3>
                <Flex
                  column
                  gap="var(--spacing-sm)"
                  className={styles.buttonWrapper}
                >
                  <UpdateButton
                    toStatus={
                      lendingRequest.status === LendingRequestStatus.Approved
                        ? LendingRequestStatus.Unapproved
                        : LendingRequestStatus.Approved
                    }
                    lendingRequest={lendingRequest}
                  />
                  <UpdateButton
                    toStatus={LendingRequestStatus.Denied}
                    lendingRequest={lendingRequest}
                  />
                  <UpdateButton
                    toStatus={LendingRequestStatus.ChangesRequested}
                    lendingRequest={lendingRequest}
                  />
                </Flex>
              </>
            )}
          </ContentSidebar>
        </ContentSection>
      )}
    </Page>
  );
};

const UpdateButton = ({
  toStatus,
  lendingRequest,
}: {
  toStatus: LendingRequestStatus;
  lendingRequest: DetailLendingRequest | AdminLendingRequest;
}) => {
  const dispatch = useAppDispatch();
  const updateLendingRequestStatus = (status: LendingRequestStatus) => {
    dispatch(editLendingRequest({ id: lendingRequest.id, status }));
  };

  return (
    <Button
      onPress={() => updateLendingRequestStatus(toStatus)}
      className={styles[toStatus]}
      disabled={toStatus == lendingRequest.status}
    >
      <Icon iconNode={statusMap[toStatus].icon} size={19} />
      <span>{statusMap[toStatus].buttonText}</span>
    </Button>
  );
};

const CommentForm = ({ lendingRequestId }: { lendingRequestId: EntityId }) => {
  const dispatch = useAppDispatch();

  return (
    <Card>
      <LegoFinalForm
        validateOnSubmitOnly
        onSubmit={(values: { text: any }, form) => {
          dispatch(
            commentOnLendingRequest({
              message: values.text,
              lending_request: lendingRequestId,
            }),
          ).then(() => {
            form.reset();
          });
        }}
      >
        {({ handleSubmit }) => (
          <Form onSubmit={handleSubmit}>
            <Flex
              justifyContent="space-between"
              alignItems="center"
              gap="var(--spacing-md)"
            >
              <div className={styles.commentField} data-test-id="comment-form">
                <Field
                  name="text"
                  placeholder="Skriv en kommentar ..."
                  component={TextInput.Field}
                  removeBorder
                  maxLength={140}
                />
              </div>

              <SubmitButton className={styles.submitButton}>Send</SubmitButton>
            </Flex>
            <SubmissionError />
          </Form>
        )}
      </LegoFinalForm>
    </Card>
  );
};

const TimeLineEntry = ({
  entry,
  isLast,
  isFirst,
}: {
  entry: TimelineEntry;
  isLast: boolean;
  isFirst: boolean;
}) => {
  return (
    <div className={styles.timelineContainer}>
      <Flex column alignItems="center" className={styles.timelineTagContainer}>
        {!isFirst && !entry.isSystem && (
          <div className={styles.timelineLineStart} />
        )}
        <Tag
          className={styles.timelineTag}
          iconNode={statusMap[entry.status]?.icon || <MessageCircleIcon />}
          tag=""
          color={statusMap[entry.status]?.color || 'blue'}
        />
        {!isLast && <div className={styles.timelineLineEnd} />}
      </Flex>
      <a href={`/users/${entry.createdBy.username}`}>
        <div
          className={
            entry.isSystem
              ? styles.timelineEntrySystemContainer
              : styles.timelineEntryMessageContainer
          }
        >
          <ProfilePicture user={entry.createdBy} size={32} />
          <h4 className={styles.timelineUsername}>
            {entry.createdBy.fullName}
          </h4>
          <Time
            className={styles.timelineTime}
            time={entry.createdAt}
            format="DD. MMM HH:mm"
          />
          <span
            className={styles.timelineText}
          >{`${entry.isSystem ? statusMap[entry.status].timelineText : entry.message}`}</span>
        </div>
      </a>
    </div>
  );
};

const RequestingUser = ({ user }: { user?: PublicUserWithGroups }) => {
  if (!user) {
    return <div>Ukjent bruker?</div>;
  }
  return (
    <Card className={styles.requestingUser}>
      <Flex alignItems="center" gap={16}>
        <a href={`/users/${user.username}`}>
          <ProfilePicture user={user} size={75} />
        </a>
        <Flex column justifyContent="center" gap={4}>
          <a href={`/users/${user.username}`}>
            <h4>{user.fullName}</h4>
          </a>
          <a href={`mailto:${user.internalEmailAddress}`}>
            {user.internalEmailAddress}
          </a>
        </Flex>
      </Flex>
    </Card>
  );
};

export default LendingRequest;
