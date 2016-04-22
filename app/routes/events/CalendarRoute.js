import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import Calendar from './components/Calendar';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  const { year, month } = params;
  props.fetchAll({ year, month });
}

function mapStateToProps(state, ownProps) {
  const { year, month } = ownProps.location.query;

  return {
    events: state.events.items,
    year,
    month
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['year', 'month'], loadData)
)(Calendar);
