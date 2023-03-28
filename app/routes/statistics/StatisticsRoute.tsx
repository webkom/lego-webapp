import { push } from 'connected-react-router';
import moment from 'moment-timezone';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchList } from 'app/actions/EventActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import Statistics from 'app/components/Statistics';
import { GroupType } from 'app/models';
import { selectEvents } from 'app/reducers/events';
import { selectGroupsWithType } from 'app/reducers/groups';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state) => {
  return {
    committees: selectGroupsWithType(state, {
      groupType: GroupType.Committee,
    }),
    revueGroups: selectGroupsWithType(state, {
      groupType: GroupType.Revue,
    }),
    previousEvents: selectEvents(state),
  };
};

function fetchEventsFromSelectedPeriod(
  dispatch,
  year: string,
  semester: string
) {
  const startMonth = semester === 'autumn' ? 6 : 0;
  const durationInMonths = semester ? 6 : 12;
  const fromDate = moment(year).startOf('year').add(startMonth, 'months');
  const toDate = moment(year)
    .startOf('year')
    .add(startMonth + durationInMonths, 'months');

  dispatch(
    push(`/statistics?year=${year}${semester ? '&semester=' + semester : ''}`)
  );

  return dispatch(
    fetchList({
      dateAfter: fromDate.format('YYYY-MM-DD'),
      dateBefore: toDate.format('YYYY-MM-DD'),
      refresh: true,
      usePagination: false,
    })
  );
}

const mapDispatchToProps = (dispatch) => ({
  onSelect: (year: string, semester: string) =>
    fetchEventsFromSelectedPeriod(dispatch, year, semester),
});

export default compose(
  withPreparedDispatch('fetchStatisticsGroups', (props, dispatch) => {
    const currentYear = String(moment().year());
    const currentSemester = moment().month() < 6 ? 'spring' : 'autumn';
    const { year, semester } = qs.parse(props.location.search, {
      ignoreQueryPrefix: true,
    });

    return Promise.all([
      dispatch(fetchAllWithType(GroupType.Committee)),
      dispatch(fetchAllWithType(GroupType.Revue)),
      fetchEventsFromSelectedPeriod(
        dispatch,
        (year as string) ?? currentYear,
        (semester as string) || currentSemester
      ),
    ]);
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(Statistics);
