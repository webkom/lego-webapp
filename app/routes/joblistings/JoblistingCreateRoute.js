// @flow
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import JoblistingEditor
  from 'app/routes/joblistings/components/JoblistingEditor';
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
  const company = formSelector(state, 'company');
  return {
    initialValues: {
      fromYear: 1,
      toYear: 5,
      jobType: 'summer_job',
      deadline: moment().toISOString(),
      visibleFrom: moment().toISOString(),
      visibleTo: moment().add(2, 'months').toISOString()
    },
    results: selectAutocomplete(state),
    company: company
      ? selectCompanyById(state, { companyId: company.id })
      : null
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'])
)(JoblistingEditor);
