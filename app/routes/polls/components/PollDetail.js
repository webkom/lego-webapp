// @flow

import React, { Component } from 'react';
import { Content } from 'app/components/Content';
import NavigationTab, { NavigationLink } from 'app/components/NavigationTab';
import Button from 'app/components/Button';
import Icon from 'app/components/Icon';
import { Link } from 'react-router';
import styles from './PollDetail.css';
import LoadingIndicator from 'app/components/LoadingIndicator';
import Poll from 'app/components/Poll';
import PollEditor from './PollEditor'

type Props = {
  poll: Object,
  editPoll: () => void,
  deletePoll: () => void,
  votePoll: () => void,
  fetching: Boolean,
  actionGrant: Array,
  initialValues: Object
};

class PollDetail extends Component<Props, *> {
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
