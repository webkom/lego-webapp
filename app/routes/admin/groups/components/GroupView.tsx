import { LoadingIndicator } from '@webkom/lego-bricks';
import { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Switch } from 'react-router-dom';
import RouteWrapper from 'app/components/RouteWrapper';
import ConnectedGroupMembers from '../components/GroupMembers';
import ConnectedGroupPermissions from '../components/GroupPermissions';
import GroupForm from './GroupForm';

type GroupModel = {
  name: string;
  description: string;
  text: string | null | undefined;
};
type GroupProps = {
  group: GroupModel;
  match: {
    path: string;
  };
};

const Group = (props: GroupProps) => {
  const { description } = props.group;
  const { match, group } = props;

  return (
    <div>
      <Helmet title={props.group.name} />
      <header>
        <h2>{props.group.name}</h2>
        <span>{description || ''}</span>
      </header>
      <Switch>
        <RouteWrapper
          path={`${match.path}/settings`}
          Component={GroupForm}
          passedProps={{
            group,
          }}
        />
        <Route
          path={`${match.path}/members`}
          component={ConnectedGroupMembers}
        />
        <RouteWrapper
          path={`${match.path}/permissions`}
          Component={ConnectedGroupPermissions}
          passedProps={{
            group,
          }}
        />
      </Switch>
    </div>
  );
};

export default class GroupView extends Component<GroupProps> {
  render() {
    const { group, match } = this.props;
    // We're loading a detailed representation of a group,
    // so make sure that the text field is there:
    const loading = !group || group.text == null;
    return (
      <section>
        <LoadingIndicator loading={loading}>
          {group && <Group group={group} match={match} />}
        </LoadingIndicator>
      </section>
    );
  }
}
