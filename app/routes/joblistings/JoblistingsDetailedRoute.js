import { connect } from 'react-redux';
import { fetchDetailed } from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { compose } from 'redux';

function loadData({ joblistingId }, props) {
  props.fetchDetailed(joblistingId);
}

function mapStateToProps(state, props) {
  const { joblistingId } = props.params;
  const joblisting = state.joblistings.byId[joblistingId];

  return {
    joblisting,
    joblistingId
  };
}

const mapDispatchToProps = { fetchDetailed };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate(['joblistingId'], loadData)
)(JoblistingDetail);
