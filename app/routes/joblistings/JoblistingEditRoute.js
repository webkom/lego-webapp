// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { selectJoblistingById } from 'app/reducers/joblistings';

const mapDispatchToProps = { handleSubmitCallback: editJoblisting, fetchJoblisting };

function loadData({ joblistingId }, props) {
  props.fetchJoblisting(joblistingId);
}

function mapStateToProps(state, props) {
  const { joblistingId } = props.params;
  const joblisting = selectJoblistingById(state, { joblistingId });
  return {
    joblisting,
    initialValues: joblisting,
    joblistingId
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['joblistingId', 'loggedIn'], loadData),
)(JoblistingEditor);
