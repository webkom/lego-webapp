import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/JoblistingActions';
import JoblistingsPage from './components/JoblistingsPage';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { compose } from 'redux';

function loadData([], props) {
  props.fetchAll();
}

function mapStateToProps(state) {
  const joblistings = state.joblistings.items
    .map((id) => state.joblistings.byId[id]);

  return {
    joblistings
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate([], loadData)
)(JoblistingsPage);
