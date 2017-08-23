// @flow
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { compose } from 'redux';
import { debounce } from 'lodash';
import { formValueSelector } from 'redux-form';
import { selectCompanyById } from 'app/reducers/companies';
import { fetch } from 'app/actions/CompanyActions';
import moment from 'moment';

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(createJoblisting(joblisting)),
    onQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
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
    results: selectAutocomplete(state)
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JoblistingEditor);
