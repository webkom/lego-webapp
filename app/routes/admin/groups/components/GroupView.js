/* eslint-disable react/prop-types */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LoadingIndicator from 'app/components/LoadingIndicator';

const Group = props => {
  const { description } = props.group;
  const descriptionText =
    description && description.length ? `(${description})` : '';

  return (
    <div>
      <header className="GroupPage__header">
        <h2>
          {props.group.name}
        </h2>
        <span>
          {descriptionText}
        </span>
      </header>

      {props.children && React.cloneElement(props.children, props)}
    </div>
  );
};

export default class GroupView extends Component {
  static propTypes = {
    group: PropTypes.object,
    children: PropTypes.object.isRequired
  };

  render() {
    const { group } = this.props;
    return (
      <section className="GroupPage__content">
        <LoadingIndicator loading={!group}>
          <section className="content event-page">
            {group && <Group {...this.props} />}
          </section>
        </LoadingIndicator>
      </section>
    );
  }
}
