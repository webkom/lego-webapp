/* eslint-disable no-unused-expressions */
import React from 'react';
import { GroupMembers } from '../GroupMembers';
import GroupMembersList from '../GroupMembersList';
import LoadingIndicator from 'app/components/LoadingIndicator';
import { shallow } from 'enzyme';
import { omit } from 'lodash';

const memberships = [
  {
    id: 1,
    role: 'member',
    abakusGroup: 1,
    user: {
      email: 'webkom@abakus.no',
      firstName: 'webkom',
      fullName: 'webkom webkom',
      id: 1,
      isActive: true,
      isStaff: false,
      lastName: 'webkom',
      username: 'webkom'
    }
  },
  {
    id: 2,
    role: 'member',
    abakusGroup: 1,
    user: {
      email: 'plebkom@abakus.no',
      firstName: 'plebkom',
      fullName: 'plebkom plebkom',
      id: 2,
      isActive: true,
      isStaff: false,
      lastName: 'plebkom',
      username: 'plebkom'
    }
  }
];

const group = {
  description: 'cool group',
  id: 1,
  name: 'Cat',
  permissions: [],
  memberships
};

describe('<GroupMembers />', () => {
  it('should render the GroupMembersList component with the user list', () => {
    const wrapper = shallow(
      <GroupMembers group={group} memberships={memberships} />
    );

    const membersList = wrapper.find(GroupMembersList);
    expect(membersList.prop('memberships')).toEqual(memberships);
  });

  it('should not render the GroupMembersList component while loading', () => {
    const wrapper = shallow(
      <GroupMembers group={omit(group, 'memberships')} />
    );

    const loadingIndicator = wrapper.find(LoadingIndicator);
    const { loading } = loadingIndicator.props();
    expect(loading).toEqual(true);
  });
});
