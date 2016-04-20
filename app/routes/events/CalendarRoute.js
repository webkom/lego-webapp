import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import Calendar from './components/Calendar';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  return {
    events: state.events.items
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate([], loadData)
)(Calendar);
