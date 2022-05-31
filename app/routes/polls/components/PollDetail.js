// @flow

import { Component } from 'react';
import { Content } from 'app/components/Content';
import { Helmet } from 'react-helmet-async';
import NavigationTab from 'app/components/NavigationTab';
import Poll from 'app/components/Poll';
import Button from 'app/components/Button';
import PollEditor from './PollEditor';
import { type PollEntity } from 'app/reducers/polls';
import { type ActionGrant, type ID } from 'app/models';

type Props = {
  poll: PollEntity,
  editPoll: (PollEntity) => Promise<*>,
  deletePoll: (id: ID) => Promise<*>,
  votePoll: (pollId: ID, optionId: ID) => Promise<*>,
  fetching: boolean,
  actionGrant: ActionGrant,
  initialValues: PollEntity,
};

type State = {
  editing: boolean,
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
          back={{ label: 'Tilbake', path: '/polls' }}
        >
          {this.props.actionGrant.includes('edit') && (
            <Button onClick={this.toggleEdit}>
              {this.state.editing ? 'Avbryt' : 'Rediger'}
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
