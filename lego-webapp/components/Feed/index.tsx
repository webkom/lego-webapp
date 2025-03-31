import { Flex } from '@webkom/lego-bricks';
import { Frown } from 'lucide-react';
import EmptyState from '~/components/EmptyState';
import ErrorBoundary from '~/components/ErrorBoundary';
import { useAppSelector } from '~/redux/hooks';
import { FeedActivityVerb } from '~/redux/models/FeedActivity';
import { selectFeedActivitiesByFeedId } from '~/redux/slices/feeds';
import Activity from './activity';
import AdminRegistrationRenderer from './renders/adminRegistration';
import AnnouncementRenderer from './renders/announcement';
import CommentRenderer from './renders/comment';
import CommentReplyRenderer from './renders/comment_reply';
import EventRegisterRenderer from './renders/event_register';
import GroupJoinRenderer from './renders/group';
import MeetingInvitationRenderer from './renders/meetingInvitation';
import RegistrationBumpRenderer from './renders/registrationBump';
import RestrictedMailSentRenderer from './renders/restrictedMail';
import type { EntityId } from '@reduxjs/toolkit';
import type { ReactNode } from 'react';
import type ActivityRenderer from '~/components/Feed/ActivityRenderer';

export const activityRenderers = {
  [FeedActivityVerb.Comment]: CommentRenderer,
  [FeedActivityVerb.CommentReply]: CommentReplyRenderer,
  [FeedActivityVerb.MeetingInvitation]: MeetingInvitationRenderer,
  [FeedActivityVerb.RestrictedMailSent]: RestrictedMailSentRenderer,
  [FeedActivityVerb.RegistrationBump]: RegistrationBumpRenderer,
  [FeedActivityVerb.AdminRegistration]: AdminRegistrationRenderer,
  [FeedActivityVerb.Announcement]: AnnouncementRenderer,
  [FeedActivityVerb.GroupJoin]: GroupJoinRenderer,
  [FeedActivityVerb.EventRegister]: EventRegisterRenderer,
};

export const getActivityRenderer = <Verb extends FeedActivityVerb>(
  verb: Verb,
) => activityRenderers[verb] as unknown as ActivityRenderer<Verb>;

type Props = {
  feedId: EntityId;
};

const Feed = ({ feedId }: Props): ReactNode => {
  const feedActivities = useAppSelector((state) =>
    selectFeedActivitiesByFeedId(state, feedId),
  );

  return (
    <Flex
      column
      gap="var(--spacing-md)"
      style={{
        width: '100%',
      }}
    >
      {feedActivities.length ? (
        feedActivities.map((item) => {
          const activityRenderer = getActivityRenderer(item.verb);
          return activityRenderer ? (
            <ErrorBoundary hidden key={item.id}>
              <Activity
                aggregatedActivity={item}
                activityRenderer={activityRenderer}
              />
            </ErrorBoundary>
          ) : null;
        })
      ) : (
        <EmptyState
          iconNode={<Frown />}
          body="Ingen aktiviteter i feeden ..."
        />
      )}
    </Flex>
  );
};

export default Feed;
