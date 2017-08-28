// @flow
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import MeetingEditor from './components/MeetingEditor';
import { editMeeting, fetchMeeting } from 'app/actions/MeetingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { selectMeetingById } from 'app/reducers/meetings';
import { debounce } from 'lodash';

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators(
      { handleSubmitCallback: editMeeting, fetchMeeting },
      dispatch
    ),
    onUserQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['users.user'])),
      30
    ),
    onGroupQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['users.abakusgroup'])),
      30
    )
  };
};

function loadData({ meetingId }, props) {
  props.fetchMeeting(meetingId);
}

function mapStateToProps(state, props) {
  const { meetingId } = props.params;
  const meeting = selectMeetingById(state, { meetingId });
  return {
    autocompleteResult: selectAutocomplete(state),
    meeting,
    initialValues: meeting,
    searching: state.search.searching,
    meetingId
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['meetingId', 'loggedIn'], loadData)
)(MeetingEditor);
