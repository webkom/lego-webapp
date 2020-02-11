// @flow

import React, { Component, type Element } from 'react';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import GroupSettings from '../components/GroupSettings';
import GroupMembers from '../components/GroupMembers';
import GroupPermissions from '../components/GroupPermissions';
import MatchType from 'app/models';

type GroupModel = {
  name: string,
  description: string,
  text: ?string
};

type GroupProps = {
  group: GroupModel,
  children?: Element<*>,
  match: MatchType
};

const Group = (props: GroupProps) => {
  const { description } = props.group;
  const descriptionText =
    description && description.length ? `(${description})` : '';
  const { match } = props;
  const { group } = props;

  return (
    <div>
      <header>
        <h2>{props.group.name}</h2>
        <span>{descriptionText}</span>
      </header>
      <Switch>
        <RouteWrapper
          path={`${match.path}/settings`}
          passedProps={{ group }}
          Component={GroupSettings}
        />
        <Route path={`${match.path}/members`} component={GroupMembers} />
        <RouteWrapper
          path={`${match.path}/permissions`}
          Component={GroupPermissions}
          passedProps={{ group }}
        />
      </Switch>
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
