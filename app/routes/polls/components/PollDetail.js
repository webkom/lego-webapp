// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Poll from 'app/components/Poll';
import PollEditor from './PollEditor'

type Props = {
  poll: Object,
  editPoll: () => Promise<*>,
  deletePoll: (id: number) => Promise<*>,
  votePoll: () => Promise<*>,
  fetching: boolean,
  actionGrant: Array<string>,
  initialValues: Object
};

type State = {
  editing: boolean
}

class PollDetail extends Component<Props, State> {
  state = {
    editing: false
  }

  toggleEdit = () => {
    this.setState({
      editing: !this.state.editing
  })}

  render() {
    return (
      <Content>
        <NavigationTab title={this.props.poll.title}>
          {this.props.actionGrant.includes('edit') && <NavigationLink onClick={this.toggleEdit}>
            {this.state.editing ? 'Avbryt' : 'Rediger'}
          </NavigationLink>}
          <NavigationLink to="/polls/">Tilbake</NavigationLink>
        </NavigationTab>
        {!this.state.editing && <Poll poll={this.props.poll} handleVote={this.props.votePoll} details/>}
        {this.state.editing && <PollEditor
          initialValues={this.props.initialValues}
          editing
          editOrCreatePoll={this.props.editPoll}
          toggleEdit={this.toggleEdit}
          deletePoll={() => this.props.deletePoll(this.props.poll.id)}/>}
      </Content>
    );
  }
}
export default PollDetail;
