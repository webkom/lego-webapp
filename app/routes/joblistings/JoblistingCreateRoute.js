// @flow
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';
import { formValueSelector } from 'redux-form';
import { fetch } from 'app/actions/CompanyActions';

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(createJoblisting(joblisting)),
    autocomplete: debounce(
      (query, filter) => dispatch(autocomplete(query, filter)),
      30
    ),
    fetchCompany: id => dispatch(fetch(id))
  };
}

function mapStateToProps(state, props) {
  const formSelector = formValueSelector('joblistingEditor');

  return {
    initialValues: {
      text: '<p></p>',
      description: '<p></p>',
      fromYear: 1,
      toYear: 5,
      jobType: 'summer_job'
    },
    isNew: true,
    autocompleteResults: selectAutocomplete(state)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JoblistingEditor);
