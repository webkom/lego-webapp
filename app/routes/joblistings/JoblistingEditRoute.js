// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchJoblisting, editJoblisting } from 'app/actions/JoblistingActions';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import EditJoblisting from 'app/routes/joblistings/components/EditJoblisting';

function loadData(params, props) {
  props.fetchJoblisting(props.joblistingId);
}

function validateJoblisting(data) {
  const errors = {};
  if (!data.name) {
    errors.name = 'Vennligst fyll ut dette feltet';
  }

  if (!data.studentContact) {
    errors.studentContact = 'Vennligst fyll ut dette feltet';
  }

  return errors;
}

function mapStateToProps(state, ownProps) {
  const joblistingId = ownProps.params.joblistingId;
  const joblisting = state.joblistings.byId[joblistingId];

  return {
    joblistingId,
    joblisting,
    initialValues: joblisting ? {
      title: joblisting.title,
      text: joblisting.text,
      company: joblisting.company,
      responsible: joblisting.responsible,
      description: joblisting.description,
      deadline: joblisting.deadline,
      visibleFrom: joblisting.visibleFrom,
      visibleTo: joblisting.visibleTo,
      jobType: joblisting.jobType,
      workplaces: joblisting.workplaces,
      fromYear: joblisting.fromYear,
      toYear: joblisting.toYear,
      applicationUrl: joblisting.applicationUrl
    } : null
  };
}

const mapDispatchToProps = { fetchJoblisting, editJoblisting };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'editJoblistings',
    validate: validateJoblisting
  }),
  fetchOnUpdate(['loggedIn', 'joblistingId'], loadData)
)(EditJoblisting);
