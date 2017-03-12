// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import JoblistingEditor
  from 'app/routes/joblistings/components/JoblistingEditor';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(editJoblisting(joblisting)),
    fetchJoblisting: id => dispatch(fetchJoblisting(id)),
    onQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
      30
    )
  };
}

function loadData({ joblistingId }, props) {
  props.fetchJoblisting(joblistingId);
}

function mapStateToProps(state, props) {
  const { joblistingId } = props.params;
  const joblisting = selectJoblistingById(state, { joblistingId });
  return {
    joblisting,
    initialValues: joblisting,
    joblistingId,
    results: selectAutocomplete(state)
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['joblistingId', 'loggedIn'], loadData)
)(JoblistingEditor);
