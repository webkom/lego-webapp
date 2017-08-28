// @flow
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import MeetingEditor from './components/MeetingEditor';
import { createMeeting } from 'app/actions/MeetingActions';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';
import moment from 'moment';

const mapDispatchToProps = dispatch => {
  return {
    ...bindActionCreators({ handleSubmitCallback: createMeeting }, dispatch),
    onUserQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['users.user'])),
      30
    )
  };
};

const time = (hours, minutes) =>
  moment().startOf('day').add({ hours, minutes }).toISOString();

function mapStateToProps(state, props) {
  return {
    reportAuthorResult: selectAutocomplete(state),
    searching: state.search.searching,
    initialValues: {
      startTime: time(17, 15),
      endTime: time(20),
      report: '<p></p>'
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(MeetingEditor);
