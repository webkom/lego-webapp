import { connect } from 'react-redux';
import { fetchJoblisting } from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { compose } from 'redux';

function loadData({ joblistingId }, props) {
  props.fetchJoblisting(joblistingId);
}

function mapStateToProps(state, props) {
  const { joblistingId } = props.params;
  const joblisting = state.joblistings.byId[joblistingId];

  return {
    joblisting,
    joblistingId
  };
}

const mapDispatchToProps = { fetchJoblisting };

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  fetchOnUpdate(['joblistingId'], loadData)
)(JoblistingDetail);
