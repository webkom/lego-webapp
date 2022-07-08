// @flow
import { connect } from 'react-redux';
import moment from 'moment-timezone';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/MeetingActions';
import { LoginPage } from 'app/components/LoginForm';
import { selectGroupedMeetings } from 'app/reducers/meetings';
import createQueryString from 'app/utils/createQueryString';
import prepare from 'app/utils/prepare';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { selectPagination } from '../../reducers/selectors';
import MeetingList from './components/MeetingList';

const mapStateToProps = (state, props) => {
  const dateAfter = moment().format('YYYY-MM-DD');
  const dateBefore = moment().format('YYYY-MM-DD');
  const fetchMoreString = createQueryString({ date_after: dateAfter });
  const fetchOlderString = createQueryString({
    date_before: dateBefore,
    ordering: '-start_time',
  });
  const showFetchMore = selectPagination('meetings', {
    queryString: fetchMoreString,
  })(state);
  const showFetchOlder = selectPagination('meetings', {
    queryString: fetchOlderString,
  })(state);

  return {
    meetingSections: selectGroupedMeetings(state),
    currentUser: props.currentUser,
    loading: state.meetings.fetching,
    showFetchMore,
    showFetchOlder,
  };
};

const fetchData = ({
  refresh,
  loadNextPage,
}: { refresh?: boolean, loadNextPage?: boolean } = {}) =>
  fetchAll({
    dateAfter: moment().subtract(0, 'weeks').format('YYYY-MM-DD'),
    refresh,
    loadNextPage,
  });

const mapDispatchToProps = {
  fetchAll,
  fetchMore: () =>
    fetchData({
      refresh: true,
      loadNextPage: true,
    }),
  fetchOlder: () =>
    fetchAll({
      dateBefore: moment().subtract(0, 'weeks').format('YYYY-MM-DD'),
      ordering: '-start_time',
      refresh: true,
      loadNextPage: true,
    }),
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  prepare((props, dispatch) => dispatch(fetchData())),
  connect(mapStateToProps, mapDispatchToProps)
)(MeetingList);
