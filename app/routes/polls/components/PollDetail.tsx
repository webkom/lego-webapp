import { Button, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom-v5-compat';
import { fetchPoll } from 'app/actions/PollActions';
import { Content } from 'app/components/Content';
import NavigationTab from 'app/components/NavigationTab';
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

  const { pollsId } = useParams();

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchPoll(pollsId));
  }, [dispatch, pollsId]);

  const poll = useAppSelector((state) => selectPollById(state, pollsId));
  const fetching = useAppSelector((state) => state.polls.fetching);
  const actionGrant = poll?.actionGrant ?? [];

  if (!poll) {
    return (
      <Content>
        <LoadingIndicator loading={fetching} />
      </Content>
    );
  }

  return (
    <Content>
      <Helmet title={poll.title} />
      <NavigationTab
        title={poll.title}
        back={{
          label: 'Tilbake',
          path: '/polls',
        }}
      >
        {actionGrant.includes('edit') && (
          <Button onClick={toggleEdit}>
            {editing ? (
              'Avbryt'
            ) : (
              <>
                <Icon name="create-outline" size={19} />
                Rediger
              </>
            )}
          </Button>
        )}
      </NavigationTab>
      {!editing && (
        <Poll
          poll={poll}
          allowedToViewHiddenResults={actionGrant.includes('edit')}
          details
        />
      )}
      {editing && <PollEditor poll={poll} editing toggleEdit={toggleEdit} />}
    </Content>
  );
};

export default guardLogin(PollDetail);
