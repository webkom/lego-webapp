import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetchJoblisting,
  deleteJoblisting
} from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { compose } from 'redux';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.params;
  const joblisting = selectJoblistingById(state, { joblistingId });
  const { actionGrant, fetching } = state.joblistings;

  return {
    joblisting,
    joblistingId,
    actionGrant,
    fetching
  };
};

const mapDispatchToProps = { fetchJoblisting, deleteJoblisting };

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
