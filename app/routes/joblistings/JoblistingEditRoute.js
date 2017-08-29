// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import { dispatched } from 'react-prepare';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { debounce } from 'lodash';
import { formValueSelector } from 'redux-form';
import { selectCompanyById } from 'app/reducers/companies';
import { fetch } from 'app/actions/CompanyActions';

function loadData({ joblistingId }, props) {
  props.fetchJoblisting(joblistingId);
}

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(editJoblisting(joblisting)),
    fetchJoblisting: id => dispatch(fetchJoblisting(id)),
    onQueryChanged: debounce(
      query => dispatch(autocomplete(query, ['companies.company'])),
      30
    ),
    fetchCompany: id => dispatch(fetch(id))
  };
}

function mapStateToProps(state, props) {
  const { joblistingId } = props.params;
  const formSelector = formValueSelector('joblistingEditor');
  const company = formSelector(state, 'company');
  let joblisting = selectJoblistingById(state, { joblistingId });
  if (!joblisting.company) {
    joblisting = {
      company: {},
      workplaces: []
    };
  }

  return {
    joblisting,
    initialValues: {
      ...joblisting,
      text: joblisting.text || '<p></p>',
      description: joblisting.description || '<p></p>',
      company: joblisting.company && {
        label: joblisting.company.name,
        value: joblisting.company.id
      },
      workplaces: joblisting.workplaces.map(workplace => ({
        label: workplace.town,
        value: workplace.town
      }))
    },
    joblistingId,
    isNew: false,
    results: selectAutocomplete(state),
    searching: state.search.searching,
    company: company ? selectCompanyById(state, { companyId: company }) : null
  };
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['joblistingId'], loadData)
)(JoblistingEditor);
