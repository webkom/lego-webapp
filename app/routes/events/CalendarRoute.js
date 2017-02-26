// @flow

import moment from 'moment';
import { dispatched } from 'react-prepare';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import Calendar from './components/Calendar';

function mapStateToProps(state, ownProps) {
  const {
    year = moment().year(),
    month = moment().month() + 1
  } = ownProps.params;

  return {
    year,
    month
  };
}

const mapDispatchToProps = { fetchAll };

// Todo: send PR to react-prepare with cwrp compare function
export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(({ year, month }, dispatch) => {
    const dateAfter = moment([parseInt(year, 10), parseInt(month, 10) - 1]).startOf('month');
    const dateBefore = dateAfter.clone().add(1, 'months').startOf('month');

    return dispatch(fetchAll({
      dateAfter: dateAfter.format('YYYY-MM-DD'),
      dateBefore: dateBefore.format('YYYY-MM-DD')
    }));
  }, { componentWillReceiveProps: false })
)(Calendar);
