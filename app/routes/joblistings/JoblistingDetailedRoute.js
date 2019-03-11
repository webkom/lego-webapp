import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import {
  fetchJoblisting,
  deleteJoblisting
} from 'app/actions/JoblistingActions';
import JoblistingDetail from './components/JoblistingDetail';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { compose } from 'redux';
import { push } from 'react-router-redux';
import getParamsFromUrl from 'app/utils/getParamsFromUrl';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.params;
  const joblisting = selectJoblistingById(state, { joblistingId });
  const { fetching } = state.joblistings;
  const actionGrant = (joblisting && joblisting.actionGrant) || [];

  let youtubeParams;
  let youtubeUrl;
  if (joblisting) {
    youtubeUrl = joblisting.youtubeUrl;
    if (youtubeUrl) {
      youtubeParams = getParamsFromUrl(youtubeUrl);
    }
  }

  return {
    joblisting,
    joblistingId,
    actionGrant,
    fetching,
    youtubeParams: youtubeUrl ? youtubeParams : {}
  };
};

const mapDispatchToProps = { fetchJoblisting, deleteJoblisting, push };

export default compose(
  dispatched(
    ({ params: { joblistingId } }, dispatch) =>
      dispatch(fetchJoblisting(joblistingId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(JoblistingDetail);
