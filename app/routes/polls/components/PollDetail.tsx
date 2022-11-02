import { Component } from 'react';
import { Content } from 'app/components/Content';
import { Helmet } from 'react-helmet-async';
import NavigationTab from 'app/components/NavigationTab';
import Poll from 'app/components/Poll';
import Button from 'app/components/Button';
import PollEditor from './PollEditor';
import type { PollEntity } from 'app/reducers/polls';
import 'app/reducers/polls';
import type { ActionGrant, ID } from 'app/models';
import 'app/models';
import Icon from 'app/components/Icon';
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
