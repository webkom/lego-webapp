import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { MoveRight } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { CommentView } from '~/components/Comments';
import {
  ContentSection,
  ContentMain,
  ContentSidebar,
} from '~/components/Content';
import { ProfilePicture } from '~/components/Image';
import Time from '~/components/Time';
import HTTPError from '~/components/errors/HTTPError';
import LendingStatusTag, { statusMap } from '~/pages/lending/LendingStatusTag';
import { useIsCurrentUser } from '~/pages/users/utils';
import {
  fetchLendingRequestById,
  editLendingRequest,
} from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { UnknownLendableObject } from '~/redux/models/LendableObject';
import {
  LendingRequestStatus,
  DetailLendingRequest,
  AdminLendingRequest,
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
  const { query, setQueryValue } = useQuery({
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
            <h3>Forespørrende bruker</h3>
            <RequestingUser user={createdByUser} />
            <h3>Periode</h3>
            <Flex alignItems="center" gap={8}>
              <Time time={lendingRequest.startDate} format="ll - HH:mm" />
              <Icon iconNode={<MoveRight />} size={19} />
              <Time time={lendingRequest.endDate} format="ll - HH:mm" />
            </Flex>
            <h3>Kommentar</h3>
            <p>{lendingRequest.text}</p>
            <CommentView
              comments={lendingRequest.comments || []}
              contentTarget={lendingRequest.contentTarget}
            />
          </ContentMain>
          <ContentSidebar>
            <h3>Status</h3>
            <LendingStatusTag lendingRequestStatus={lendingRequest.status} />
            {isCurrentUser && (
              <div className={styles.buttonWrapper}>
                <UpdateButton
                  toStatus={LendingRequestStatus.Cancelled}
                  lendingRequest={lendingRequest}
                />
              </div>
            )}
            {isAdmin && (
              <>
                <h3>Admin</h3>
                <Flex column gap={8} className={styles.buttonWrapper}>
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
