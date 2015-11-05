/* eslint-disable react/prop-types */
import React, { Component, PropTypes } from 'react';
import LoadingIndicator from './ui/LoadingIndicator';

const Group = props => (
  <div>
    <h2>{props.group.name}</h2>
    <p>{props.group.description}</p>
    {React.cloneElement(props.children, props)}
  </div>
);

export default class GroupView extends Component {
  static propTypes = {
    group: PropTypes.object,
    children: PropTypes.object.isRequired
  }

  render() {
    const { group } = this.props;
    return (
      <section>
        <LoadingIndicator loading={!group}>
          <section className='content event-page'>
            {group && <Group {...this.props} />}
          </section>
        </LoadingIndicator>
      </section>
    );
  }
}
