

import React, { Component, type Element } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';

type GroupModel = {
  name: string,
  description: string,
  text: ?string
};

type GroupProps = {
  group: GroupModel,
  children?: Element<*>
};

const Group = (props: GroupProps) => {
  const { description } = props.group;
  const descriptionText =
    description && description.length ? `(${description})` : '';

  return (
    <div>
      <header>
        <h2>{props.group.name}</h2>
        <span>{descriptionText}</span>
      </header>

      {props.children && React.cloneElement(props.children, props)}
    </div>
  );
};

type GroupViewProps = {
  group: GroupModel
};

export default class GroupView extends Component<GroupViewProps> {
  render() {
    const { group } = this.props;
    // We're loading a detailed representation of a group,
    // so make sure that the text field is there:
    const loading = !group || group.text == null;
    return (
      <section>
        <LoadingIndicator loading={loading}>
          {group && <Group {...this.props} />}
        </LoadingIndicator>
      </section>
    );
  }
}
