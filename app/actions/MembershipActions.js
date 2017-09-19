import { membershipSchema } from 'app/reducers';
import callAPI from 'app/actions/callAPI';
import { Membership } from './ActionTypes';

export function setGroupMembers(groupId, memberships) {
  return callAPI({
    types: Membership.MEMBER_SET,
    endpoint: `/memberships/${groupId}/set-all/`,
    schema: [membershipSchema],
    method: 'POST',
    body: {
      memberships
    },
    meta: {
      id: groupId,
      errorMessage: 'Failed to update memberships of the group.'
    },
    disableOptimistic: true
  });
}
