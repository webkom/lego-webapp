import {
  Button,
  ButtonGroup,
  Flex,
  Icon,
  LinkButton,
  LoadingPage,
  Modal,
  Page,
} from '@webkom/lego-bricks';
import { diffLines } from 'diff';
import { isEmpty } from 'lodash';
import { ListRestart, Pencil } from 'lucide-react';
import moment from 'moment-timezone';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useParams } from 'react-router-dom';
import { setInvitationStatus } from 'app/actions/MeetingActions';
import AddToCalendar from 'app/components/AddToCalendar/AddToCalendar';
import AnnouncementInLine from 'app/components/AnnouncementInLine';
import CommentView from 'app/components/Comments/CommentView';
import {
  ContentSection,
  ContentSidebar,
  ContentMain,
} from 'app/components/Content';
import DisplayContent from 'app/components/DisplayContent';
import Dropdown from 'app/components/Dropdown';
import { ProfilePicture } from 'app/components/Image';
import InfoList from 'app/components/InfoList';
import LegoReactions from 'app/components/LegoReactions';
import { MazemapEmbed } from 'app/components/MazemapEmbed';
import Time, { FromToTime } from 'app/components/Time';
import Tooltip from 'app/components/Tooltip';
import Attendance from 'app/components/UserAttendance/Attendance';
import { useCurrentUser } from 'app/reducers/auth';
import { selectCommentsByIds } from 'app/reducers/comments';
import {
  selectMeetingInvitationByMeetingIdAndUserId,
  selectMeetingInvitationsForMeeting,
  statusesText,
} from 'app/reducers/meetingInvitations';
import { selectMeetingById } from 'app/reducers/meetings';
import { selectUserById } from 'app/reducers/users';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { MeetingInvitationStatus } from 'app/store/models/MeetingInvitation';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
import urlifyString from 'app/utils/urlifyString';
import styles from './MeetingDetail.css';
import type { Dateish } from 'app/models';
import type { DetailedMeeting } from 'app/store/models/Meeting';
import type { PublicUser } from 'app/store/models/User';

const UserLink = ({ user }: { user?: PublicUser }) =>
  user && !isEmpty(user) ? (
    <Link to={`/users/${user.username}`}>{user.fullName}</Link>
  ) : (
    <span>Ikke valgt</span>
  );

type MeetingDetailParams = {
  meetingId: string;
};

const MeetingDetails = () => {
  const { meetingId } = useParams<MeetingDetailParams>() as MeetingDetailParams;
  const currentUser = useCurrentUser();
  const icalToken = currentUser?.icalToken;
  const meeting = useAppSelector((state) =>
    selectMeetingById<DetailedMeeting>(state, meetingId),
  );
  const comments = useAppSelector((state) =>
    selectCommentsByIds(state, meeting?.comments),
  );
  const reportAuthor = useAppSelector((state) =>
    selectUserById<PublicUser>(state, meeting?.reportAuthor),
  );
  const createdBy = useAppSelector((state) =>
    selectUserById<PublicUser>(state, meeting?.createdBy),
  );
  const meetingInvitations = useAppSelector((state) =>
    selectMeetingInvitationsForMeeting(state, meetingId),
  );
  const currentUserInvitation = useAppSelector(
    (state) =>
      currentUser &&
      selectMeetingInvitationByMeetingIdAndUserId(
        state,
        meetingId,
        currentUser.id,
      ),
  );

  const dispatch = useAppDispatch();

  const setMeetingInvitationStatus = (newStatus: MeetingInvitationStatus) => {
    currentUser &&
      meeting?.id &&
      dispatch(setInvitationStatus(meeting?.id, newStatus, currentUser));
  };

  const acceptInvitation = () =>
    setMeetingInvitationStatus(MeetingInvitationStatus.Attending);

  const rejectInvitation = () =>
    setMeetingInvitationStatus(MeetingInvitationStatus.NotAttending);

  const sortInvitations = () => {
    return Object.values(MeetingInvitationStatus).map((invitationStatus) => ({
      name: statusesText[invitationStatus],
      capacity: meetingInvitations.length,
      registrations: meetingInvitations.filter(
        (invite) => invite.status === invitationStatus,
      ),
    }));
  };

  const [changelogOpen, setChangelogOpen] = useState(false);
  const [diff, setDiff] = useState<
    { count: number; added: boolean; removed: boolean; value: string }[]
  >([]);

  const handleChangelogClick = (index: number) => {
    if (!meeting) return;

    const currentReport = meeting.reportChangelogs[index].report;
    const previousReport =
      index < meeting.reportChangelogs.length - 1
        ? meeting.reportChangelogs[index + 1].report
        : '';
    const diff = diffLines(previousReport, currentReport);
    setDiff(diff);
  };

  const attendanceButtons = (
    statusMe: string | null | undefined,
    startTime: Dateish,
  ) =>
    statusMe &&
    moment(startTime) > moment() && (
      <ButtonGroup className={styles.statusButtons}>
        <Button
          success
          onPress={acceptInvitation}
          disabled={statusMe === MeetingInvitationStatus.Attending}
        >
          Delta
        </Button>
        <Button
          dark
          onPress={rejectInvitation}
          disabled={statusMe === MeetingInvitationStatus.NotAttending}
        >
          Avslå
        </Button>
      </ButtonGroup>
    );

  if (!meeting || !currentUser) {
    return <LoadingPage loading />; // TODO: proper loading behavior once separate fetching state is implemented
  }

  const statusMe = currentUserInvitation?.status;
  const actionGrant = meeting?.actionGrant;
  const canEdit = actionGrant?.includes('edit');
  const infoItems = [
    {
      key: 'Din status',
      value: statusMe ? statusesText[statusMe] : 'Ukjent',
    },
    {
      key: 'Når',
      value: <FromToTime from={meeting.startTime} to={meeting.endTime} />,
    },
    {
      key: 'Sted',
      value: `${meeting.location}`,
    },
    {
      key: 'Forfatter',
      value: <UserLink user={createdBy} />,
    },
    {
      key: 'Referent',
      value: <UserLink user={reportAuthor} />,
    },
  ];

  return (
    <Page
      title={meeting.title}
      back={{
        label: 'Dine møter',
        href: '/meetings',
      }}
    >
      <Helmet title={meeting.title} />

      <ContentSection>
        <ContentMain>
          {meeting.description && (
            <div>{urlifyString(meeting.description)}</div>
          )}
          <Flex alignItems="center" gap="var(--spacing-sm)">
            <h2>Referat</h2>
            {meeting.reportChangelogs?.length > 1 && (
              <Dropdown
                show={changelogOpen}
                toggle={() => setChangelogOpen(!changelogOpen)}
                contentClassName={styles.changelogDropdown}
                triggerComponent={
                  <Icon
                    iconNode={<ListRestart />}
                    size={18}
                    className="secondaryFontColor"
                  />
                }
              >
                <Dropdown.List>
                  {meeting.reportChangelogs.map((reportChangelog, index) => (
                    <>
                      <Dropdown.ListItem>
                        <button onClick={() => handleChangelogClick(index)}>
                          <Flex alignItems="center" gap="var(--spacing-sm)">
                            <ProfilePicture
                              user={reportChangelog.createdBy}
                              size={24}
                            />
                            <span>
                              <strong>
                                {reportChangelog.createdBy.username}
                              </strong>{' '}
                              {index === meeting.reportChangelogs.length - 1
                                ? 'opprettet'
                                : 'redigerte'}{' '}
                              for{' '}
                              <Tooltip
                                content={moment(
                                  reportChangelog.createdAt,
                                ).format('lll')}
                                positions="right"
                                containerClassName={
                                  styles.reportChangelogTooltip
                                }
                              >
                                <Time
                                  time={reportChangelog.createdAt}
                                  wordsAgo
                                  className={styles.changelogTime}
                                />
                              </Tooltip>
                            </span>
                          </Flex>
                        </button>
                      </Dropdown.ListItem>
                      {index !== meeting.reportChangelogs.length - 1 && (
                        <Dropdown.Divider />
                      )}
                    </>
                  ))}
                </Dropdown.List>
                {!isEmpty(diff) && (
                  <Modal
                    title="Endringer"
                    isOpen
                    onOpenChange={() => setDiff([])}
                  >
                    <DisplayContent
                      content={diff
                        .map((part) =>
                          part.added
                            ? `<ins>${part.value}</ins>`
                            : part.removed
                              ? `<del>${part.value}</del>`
                              : part.value,
                        )
                        .join('')}
                    />
                  </Modal>
                )}
              </Dropdown>
            )}
          </Flex>
          <DisplayContent content={meeting.report} />
        </ContentMain>
        <ContentSidebar>
          <ul>
            {attendanceButtons(statusMe, meeting.startTime)}
            <InfoList items={infoItems} />
            <Attendance isMeeting pools={sortInvitations()} />
            {meeting.mazemapPoi && (
              <MazemapEmbed mazemapPoi={meeting.mazemapPoi} />
            )}

            {icalToken && (
              <li>
                <AddToCalendar icalToken={icalToken} meeting={meeting} />
              </li>
            )}
          </ul>

          <h3>Admin</h3>
          <ButtonGroup>
            <AnnouncementInLine meeting={meeting} />
            {canEdit && (
              <LinkButton href={`/meetings/${meeting.id}/edit`}>
                <Icon iconNode={<Pencil />} size={19} />
                Rediger
              </LinkButton>
            )}
          </ButtonGroup>
        </ContentSidebar>
      </ContentSection>
      <ContentSection>
        <ContentMain>
          {meeting.contentTarget && (
            <>
              <div className={styles.meetingReactions}>
                <LegoReactions parentEntity={meeting} showPeople />
              </div>
              <CommentView
                contentTarget={meeting.contentTarget}
                comments={comments}
                contentAuthors={meeting.createdBy}
              />
            </>
          )}
        </ContentMain>
      </ContentSection>
    </Page>
  );
};

export default guardLogin(MeetingDetails);
