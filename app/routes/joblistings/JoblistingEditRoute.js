// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocomplete } from 'app/reducers/search';
import { debounce } from 'lodash';
import { formValueSelector } from 'redux-form';

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(editJoblisting(joblisting)),
    fetchJoblisting: id => dispatch(fetchJoblisting(id)),
    autocomplete: debounce(
      (query, filter) => dispatch(autocomplete(query, filter)),
      30
    )
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
      company: joblisting.company
        ? {
            label: joblisting.company.name,
            value: joblisting.company.id
          }
        : {},
      responsible: joblisting.responsible
        ? {
            label: joblisting.responsible.name,
            value: joblisting.responsible.id
          }
        : { label: 'Ingen', value: null },
      workplaces: (joblisting.workplaces || []).map(workplace => ({
        label: workplace.town,
        value: workplace.town
      }))
    },
    joblistingId,
    isNew: false,
    autocompleteResults: selectAutocomplete(state),
    searching: state.search.searching,
    company: company ? company : {}
  };
}

export default compose(
  dispatched(
    ({ params: { joblistingId } }, dispatch) =>
      dispatch(fetchJoblisting(joblistingId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingEditor);
