import { Button, Icon, LoadingIndicator, Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom';
import { fetchPoll } from 'app/actions/PollActions';
import Poll from 'app/components/Poll';
import { selectPollById } from 'app/reducers/polls';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import { guardLogin } from 'app/utils/replaceUnlessLoggedIn';
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
    return (
      <Page>
        <LoadingIndicator loading={fetching} />
      </Page>
    );
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
                <Icon name="create-outline" size={19} />
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
