import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { compose } from 'redux';

import {
  deleteJoblisting,
  fetchJoblisting,
} from 'app/actions/JoblistingActions';
import { selectJoblistingById } from 'app/reducers/joblistings';
import prepare from 'app/utils/prepare';
import JoblistingDetail from './components/JoblistingDetail';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.match.params;
  const joblisting = selectJoblistingById(state, { joblistingId });
  const { fetching } = state.joblistings;
  const actionGrant = (joblisting && joblisting.actionGrant) || [];

  return {
    joblisting,
    joblistingId,
    actionGrant,
    fetching,
  };
};

const mapDispatchToProps = { fetchJoblisting, deleteJoblisting, push };

export default compose(
  prepare(
    (
      {
        match: {
          params: { joblistingId },
        },
      },
      dispatch
    ) => dispatch(fetchJoblisting(joblistingId))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingDetail);
