// @flow

import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import Calendar from './components/Calendar';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  const { year, month } = params;
  const dateAfter = moment([parseInt(year, 10), parseInt(month, 10) - 1]).startOf('month');
  const dateBefore = dateAfter.clone().add(1, 'months').startOf('month');
  props.fetchAll({
    dateAfter: dateAfter.format('YYYY-MM-DD'),
    dateBefore: dateBefore.format('YYYY-MM-DD') });
}

function mapStateToProps(state, ownProps) {
  const {
    year = moment().year(),
    month = moment().month() + 1
  } = ownProps.location.query;

  return {
    year,
    month
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['year', 'month', 'loggedIn'], loadData)
)(Calendar);
