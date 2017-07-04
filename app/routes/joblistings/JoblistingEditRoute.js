// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import { dispatched } from 'react-prepare';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';
import { formValueSelector } from 'redux-form';
import { selectCompanyById } from 'app/reducers/companies';
import { fetch } from 'app/actions/CompanyActions';

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
  console.log('company', company, company.value);
  const companyId = company.value;
  const joblisting = selectJoblistingById(state, { joblistingId });
  console.log('company22', selectCompanyById(state, { companyId }));
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
    results: selectAutocomplete(state),
    searching: state.search.searching,
    company: company ? selectCompanyById(state, { companyId: company }) : null
  };
}

export default compose(
  dispatched(
    ({ params: { joblistingId } }, dispatch) =>
      dispatch(fetchJoblisting(Number(joblistingId))),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingEditor);
