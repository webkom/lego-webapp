import {
  Button,
  Card,
  Flex,
  Icon,
  LoadingIndicator,
  Page,
} from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import {
  CircleAlert,
  CircleCheckBig,
  CircleDashed,
  CircleX,
  MoveRight,
  Tag,
} from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router';
import styles from './LendingRequestDetail.module.css';
import type { ReactNode } from 'react';
import { CommentView } from '~/components/Comments';
import { ContentSection, ContentMain, ContentSidebar } from '~/components/Content';
import { ProfilePicture } from '~/components/Image';
import { TagColors } from '~/components/Tags/Tag';
import Time from '~/components/Time';
import { useIsCurrentUser } from '~/pages/users/utils';
import { fetchLendingRequestById, editLendingRequest } from '~/redux/actions/LendingRequestActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { UnknownLendableObject } from '~/redux/models/LendableObject';
import { LendingRequestStatus, DetailLendingRequest, AdminLendingRequest } from '~/redux/models/LendingRequest';
import { PublicUserWithGroups } from '~/redux/models/User';
import { selectLendableObjectById } from '~/redux/slices/lendableObjects';
import { selectLendingRequestById } from '~/redux/slices/lendingRequests';
import { selectUserById } from '~/redux/slices/users';

const statusMap: Record<
  LendingRequestStatus,
  {
    tag: string;
    buttonText: string;
    icon: ReactNode;
    color: TagColors;
  }
> = {
  [LendingRequestStatus.Unapproved]: {
    tag: 'Venter på godkjenning',
    buttonText: 'Fjern godkjenning',
    icon: <CircleDashed className={styles.rotate} />,
    color: 'orange',
  },
  [LendingRequestStatus.Approved]: {
    tag: 'Godkjent',
    buttonText: 'Godkjenn',
    icon: <CircleCheckBig />,
    color: 'green',
  },
  [LendingRequestStatus.Denied]: {
    tag: 'Avslått',
    buttonText: 'Avslå',
    icon: <CircleX />,
    color: 'red',
  },
  [LendingRequestStatus.Cancelled]: {
    tag: 'Kansellert',
    buttonText: 'Kanseller forespørsel',
    icon: <CircleX />,
    color: 'red',
  },
  [LendingRequestStatus.ChangesRequested]: {
    tag: 'Endringer forespurt',
    buttonText: 'Forespør endringer',
    icon: <CircleAlert />,
    color: 'orange',
  },
};

type Params = {
  lendingRequestId: string;
  lendableObjectId: string;
};

const LendingRequest = () => {
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

  if (fetching) {
    return <LoadingIndicator loading />;
  }

  const isAdmin = lendingRequest?.actionGrant?.includes('edit');

  const title = `Forespørsel ${lendableObject?.title ? ` - ${lendableObject.title}` : ''}`;

  return (
    <Page title={title} back={{ href: '/lending' }} skeleton={fetching}>
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
              comments={lendingRequest.comments}
              contentTarget={lendingRequest.contentTarget}
            />
          </ContentMain>
          <ContentSidebar>
            <h3>Status</h3>
            <Tag
              iconNode={statusMap[lendingRequest.status].icon}
              iconSize={22}
              color={statusMap[lendingRequest.status].color}
              tag={statusMap[lendingRequest.status].tag}
              className={styles.statusTag}
              gap="var(--spacing-md)"
            />
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
        <Link to={`/users/${user.username}`}>
          <ProfilePicture user={user} size={75} />
        </Link>
        <Flex column justifyContent="center" gap={4}>
          <Link to={`/users/${user.username}`}>
            <h4>{user.fullName}</h4>
          </Link>
          <Link to={`mailto:${user.internalEmailAddress}`}>
            {user.internalEmailAddress}
          </Link>
        </Flex>
      </Flex>
    </Card>
  );
};

export default LendingRequest;
