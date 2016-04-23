import { arrayOf } from 'normalizr';
import { groupSchema } from 'app/reducers';
import { Group } from './ActionTypes';
import { callAPI } from 'app/utils/http';
import { catchErrorAsNotification } from './NotificationActions';

export function fetchGroup(groupId) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [Group.FETCH_BEGIN, Group.FETCH_SUCCESS, Group.FETCH_FAILURE],
      endpoint: `/groups/${groupId}/`,
      schema: groupSchema
    })).catch(catchErrorAsNotification(dispatch, 'Fetching group failed'));
  };
}

export function fetchAll() {
  return (dispatch) => {
    dispatch(callAPI({
      types: [Group.FETCH_ALL_BEGIN, Group.FETCH_ALL_SUCCESS, Group.FETCH_ALL_FAILURE],
      endpoint: '/groups/',
      schema: arrayOf(groupSchema)
    })).catch(catchErrorAsNotification(dispatch, 'Fetching groups failed'));
  };
}

export function updateGroup({ groupId, updates }) {
  return (dispatch) => {
    dispatch(callAPI({
      types: [Group.UPDATE_BEGIN, Group.UPDATE_SUCCESS, Group.UPDATE_FAILURE],
      endpoint: `/groups/${groupId}/`,
      method: 'patch',
      body: updates,
      schema: groupSchema
    })).catch(catchErrorAsNotification(dispatch, 'Updating group failed'));
  };
}
