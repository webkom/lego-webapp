// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchCompanyContacts } from 'app/actions/CompanyActions';
import { createJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { push } from 'connected-react-router';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import time from 'app/utils/time';

const mapStateToProps = () => ({
  initialValues: {
    text: '',
    description: '',
    visibleFrom: time({ hours: 12 }),
    visibleTo: time({ days: 31, hours: 23, minutes: 59 }),
    deadline: time({ days: 30, hours: 23, minutes: 59 }),
    fromYear: 1,
    toYear: 5,
    jobType: 'summer_job',
    workplaces: []
  },
  isNew: true
});

const mapDispatchToProps = {
  submitJoblisting: createJoblisting,
  fetchCompanyContacts,
  push
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(JoblistingEditor);
