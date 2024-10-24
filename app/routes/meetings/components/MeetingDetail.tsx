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
import { isEmpty } from 'lodash';
import { ListRestart, Pencil } from 'lucide-react';
import moment from 'moment-timezone';
import diff from 'node-htmldiff';
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
import { PizzaMettingbutton } from 'app/components/PizzaMeetingButton';
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
import styles from './MeetingDetail.module.css';
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
  const [_diff, setDiff] = useState('');

  const handleChangelogClick = (index: number) => {
    if (!meeting) return;

    const currentReport = meeting.reportChangelogs[index].report;
    const previousReport =
      index < meeting.reportChangelogs.length - 1
        ? meeting.reportChangelogs[index + 1].report
        : '';

    setDiff(diff(previousReport, currentReport));
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
  const pizzaActivated =
    meeting.reactionsGrouped?.find((reaction) => reaction.emoji === ':pizza:')
      ?.count ?? false;
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
                    <Dropdown.ListItem key={index}>
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
                              content={moment(reportChangelog.createdAt).format(
                                'lll',
                              )}
                              positions="right"
                              className={styles.changelogTooltip}
                              containerClassName={
                                styles.changelogTooltipContainer
                              }
                            >
                              <Time time={reportChangelog.createdAt} wordsAgo />
                            </Tooltip>
                          </span>
                        </Flex>
                      </button>
                      {index !== meeting.reportChangelogs.length - 1 && (
                        <Dropdown.Divider />
                      )}
                    </Dropdown.ListItem>
                  ))}
                </Dropdown.List>
                {!isEmpty(_diff) && (
                  <Modal
                    title="Endringer"
                    isOpen
                    onOpenChange={() => setDiff('')}
                  >
                    <DisplayContent content={_diff} />
                  </Modal>
                )}
              </Dropdown>
            )}
          </Flex>
          <DisplayContent content={meeting.report} />
        </ContentMain>
        <ContentSidebar>
          {attendanceButtons(statusMe, meeting.startTime)}
          <InfoList items={infoItems} />

          <Attendance isMeeting pools={sortInvitations()} />

          {meeting.mazemapPoi && (
            <MazemapEmbed mazemapPoi={meeting.mazemapPoi} />
          )}

          {icalToken && (
            <AddToCalendar icalToken={icalToken} meeting={meeting} />
          )}

          <div>
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
          </div>
          {pizzaActivated && (
            <div>
              <h3>Pizza</h3>
              <ButtonGroup>
                <PizzaMettingbutton
                  meeting={meeting}
                  meetingInvitations={meetingInvitations}
                ></PizzaMettingbutton>
              </ButtonGroup>
            </div>
          )}
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
