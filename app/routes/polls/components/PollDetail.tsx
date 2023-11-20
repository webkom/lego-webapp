import { Button, Icon, LoadingIndicator } from '@webkom/lego-bricks';
import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams } from 'react-router-dom-v5-compat';
import { fetchPoll } from 'app/actions/PollActions';
import { Content } from 'app/components/Content';
import { LoginPage } from 'app/components/LoginForm';
import NavigationTab from 'app/components/NavigationTab';
import Poll from 'app/components/Poll';
import { selectIsLoggedIn } from 'app/reducers/auth';
import { selectPollById } from 'app/reducers/polls';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';
import PollEditor from './PollEditor';

const PollDetail = () => {
  const loggedIn = useAppSelector(selectIsLoggedIn);
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

  if (!loggedIn) {
    return <LoginPage />;
  }

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

export default PollDetail;
