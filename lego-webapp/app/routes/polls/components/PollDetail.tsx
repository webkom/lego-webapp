import { Button, Icon, LoadingPage, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { Pencil } from 'lucide-react';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router';
import Poll from '~/components/Poll';
import { fetchPoll } from '~/redux/actions/PollActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectPollById } from '~/redux/slices/polls';
import { guardLogin } from '~/utils/replaceUnlessLoggedIn';
import PollEditor from './PollEditor';

const PollDetail = () => {
  const [editing, setEditing] = useState(false);

  const toggleEdit = () => {
    setEditing(!editing);
  };

  const { pollsId } = useParams<{ pollsId: string }>();

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchPoll',
    () => pollsId && dispatch(fetchPoll(pollsId)),
    [],
  );

  const poll = useAppSelector((state) => selectPollById(state, pollsId));
  const fetching = useAppSelector((state) => state.polls.fetching);
  const actionGrant = poll?.actionGrant ?? [];

  if (!poll) {
    return <LoadingPage loading={fetching} />;
  }

  return (
    <Page
      title={poll.title}
      back={{ href: '/polls' }}
      actionButtons={
        actionGrant.includes('edit') && (
          <Button onPress={toggleEdit}>
            {editing ? (
              'Avbryt'
            ) : (
              <>
                <Icon iconNode={<Pencil />} size={19} />
                Rediger
              </>
            )}
          </Button>
        )
      }
    >
      <Helmet title={poll.title} />
      {!editing ? (
        <Poll
          poll={poll}
          allowedToViewHiddenResults={actionGrant.includes('edit')}
          details
          alwaysOpen
        />
      ) : (
        <PollEditor poll={poll} editing toggleEdit={toggleEdit} />
      )}
    </Page>
  );
};

export default guardLogin(PollDetail);
