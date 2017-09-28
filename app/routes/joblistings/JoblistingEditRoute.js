// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { selectJoblistingById } from 'app/reducers/joblistings';
import { formValueSelector } from 'redux-form';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = (state, props) => {
  const { joblistingId } = props.params;
  const formSelector = formValueSelector('joblistingEditor');
  const company = formSelector(state, 'company');
  const joblisting = selectJoblistingById(state, { joblistingId }) || {};

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
    company: company ? company : {}
  };
};

const mapDispatchToProps = {
  submitJoblisting: editJoblisting
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  dispatched(
    ({ params: { joblistingId } }, dispatch) =>
      dispatch(fetchJoblisting(joblistingId)),
    {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingEditor);
