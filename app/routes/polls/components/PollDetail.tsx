import { Button } from '@webkom/lego-bricks';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Content } from 'app/components/Content';
import Icon from 'app/components/Icon';
import NavigationTab from 'app/components/NavigationTab';
import Poll from 'app/components/Poll';
import type { ActionGrant, ID } from 'app/models';
import type { PollEntity } from 'app/reducers/polls';
import PollEditor from './PollEditor';

type Props = {
  poll: PollEntity;
  editPoll: (arg0: PollEntity) => Promise<any>;
  deletePoll: (id: ID) => Promise<any>;
  votePoll: (pollId: ID, optionId: ID) => Promise<any>;
  fetching: boolean;
  actionGrant: ActionGrant;
  initialValues: PollEntity;
};
type State = {
  editing: boolean;
};

class PollDetail extends Component<Props, State> {
  state = {
    editing: false,
  };
  toggleEdit = () => {
    this.setState({
      editing: !this.state.editing,
    });
  };

  render() {
    return (
      <Content>
        <Helmet title={this.props.poll.title} />
        <NavigationTab
          title={this.props.poll.title}
          back={{
            label: 'Tilbake',
            path: '/polls',
          }}
        >
          {this.props.actionGrant.includes('edit') && (
            <Button onClick={this.toggleEdit}>
              {this.state.editing ? (
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
        {!this.state.editing && (
          <Poll
            poll={this.props.poll}
            handleVote={this.props.votePoll}
            allowedToViewHiddenResults={this.props.actionGrant.includes('edit')}
            details
          />
        )}
        {this.state.editing && (
          <PollEditor
            initialValues={this.props.initialValues}
            editing
            editOrCreatePoll={this.props.editPoll}
            toggleEdit={this.toggleEdit}
            deletePoll={() => this.props.deletePoll(this.props.poll.id)}
          />
        )}
      </Content>
    );
  }
}

export default PollDetail;
