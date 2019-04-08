import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import {
  fetchJoblisting,
  deleteJoblisting
} from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { compose } from 'redux';
import { push } from 'connected-react-router';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.params;
  const joblisting = selectJoblistingById(state, { joblistingId });
  const { fetching } = state.joblistings;
  const actionGrant = (joblisting && joblisting.actionGrant) || [];

  return {
    joblisting,
    joblistingId,
    actionGrant,
    fetching
  };
};

const mapDispatchToProps = { fetchJoblisting, deleteJoblisting, push };

export default compose(
  prepare(({ params: { joblistingId } }, dispatch) =>
    dispatch(fetchJoblisting(joblistingId))
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(JoblistingDetail);
