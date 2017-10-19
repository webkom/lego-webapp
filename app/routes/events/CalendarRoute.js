// @flow

import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchList } from 'app/actions/EventActions';
import prepare from 'app/utils/prepare';
import Calendar from './components/Calendar';

const getDate = ({ params }) => {
  const year = params.year || moment().year();
  const month = params.month || moment().month() + 1;
  return moment([parseInt(year, 10), parseInt(month, 10) - 1]);
};

const loadData = (props, dispatch) => {
  const date = getDate(props);
  console.log('load', date.toString());
  console.log(props);
  if (date.isValid()) {
    const dateAfter = date
      .clone()
      .startOf('month')
      .startOf('week');
    const dateBefore = date
      .clone()
      .endOf('month')
      .endOf('week');
    return dispatch(
      fetchList({
        dateAfter: dateAfter.format('YYYY-MM-DD'),
        dateBefore: dateBefore.format('YYYY-MM-DD')
      })
    );
  }

  return Promise.resolve();
};

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.currentUser;
  const icalToken = user ? user.icalToken : null;
  console.log('hello', getDate(ownProps).toString());
  const actionGrant = state.events.actionGrant;
  return {
    date: getDate(ownProps),
    actionGrant,
    icalToken
  };
};

const mapDispatchToProps = { fetchList };

export default compose(
  prepare(loadData, ['date']),
  connect(mapStateToProps, mapDispatchToProps)
)(Calendar);
