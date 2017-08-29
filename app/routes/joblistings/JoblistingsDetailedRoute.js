import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchJoblisting } from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import { compose } from 'redux';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.params;
  const joblisting = state.joblistings.byId[joblistingId];

  return {
    joblisting,
    joblistingId
  };
};

const mapDispatchToProps = { fetchJoblisting };

export default compose(
  dispatched(
    ({ params: { joblistingId } }, dispatch) =>
      dispatch(fetchJoblisting(joblistingId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingDetail);
