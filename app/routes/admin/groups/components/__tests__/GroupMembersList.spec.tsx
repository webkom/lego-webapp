/* eslint-disable no-unused-expressions */
import { LoadingIndicator } from '@webkom/lego-bricks';
import { shallow } from 'enzyme';
import { omit } from 'lodash';
import { describe, it, expect } from 'vitest';
import { GroupMembers } from '../GroupMembers';
import GroupMembersList from '../GroupMembersList';

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
      username: 'webkom',
    },
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
      username: 'plebkom',
    },
  },
];
const group = {
  description: 'cool group',
  id: 1,
  name: 'Cat',
  permissions: [],
  memberships,
};
describe('<GroupMembers />', () => {
  it('should render the GroupMembersList component with the user list', () => {
    const wrapper = shallow(
      <GroupMembers
        groupsById={{
          [group.id]: group,
        }}
        groupId={group.id}
        memberships={memberships}
      />
    );
    const membersList = wrapper.find(GroupMembersList);
    expect(membersList.prop('memberships')).toEqual(memberships);
  });
  it('should not render the GroupMembersList component while loading', () => {
    const wrapper = shallow(
      <GroupMembers
        groupsById={{
          [group.id]: omit(group, 'memberships'),
        }}
        groupId={group.id}
        memberships={undefined}
      />
    );
    const loadingIndicator = wrapper.find(LoadingIndicator);
    const { loading } = loadingIndicator.props();
    expect(loading).toBe(true);
  });
});
