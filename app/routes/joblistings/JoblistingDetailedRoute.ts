import { connect } from 'react-redux';
import { fetchJoblisting } from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import { selectJoblistingById } from 'app/store/slices/joblistingsSlice';
import { compose } from 'redux';
import { push } from 'connected-react-router';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.match.params;
  const joblisting = selectJoblistingById(state, {
    joblistingId,
  });
  const { fetching } = state.joblistings;
  const actionGrant = (joblisting && joblisting.actionGrant) || [];
  return {
    joblisting,
    joblistingId,
    actionGrant,
    fetching,
  };
};

const mapDispatchToProps = {
  fetchJoblisting,
  push,
};
export default compose(
  withPreparedDispatch('fetchJoblistingDetailed', (props, dispatch) =>
    dispatch(fetchJoblisting(props.match.params.joblistingId))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingDetail);
