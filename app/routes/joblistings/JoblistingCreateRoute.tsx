import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchCompanyContacts } from 'app/actions/CompanyActions';
import { createJoblisting } from 'app/actions/JoblistingActions';
import { LoginPage } from 'app/components/LoginForm';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import time from 'app/utils/time';
import { yearValues, jobTypes } from './constants';

const mapStateToProps = () => ({
  initialValues: {
    // The text and description initialValues need to be different
    // due to how the editor needs different states to focus properly initially.
    text: '<p></p>',
    description: '',
    visibleFrom: time({
      hours: 12,
    }),
    visibleTo: time({
      days: 31,
      hours: 23,
      minutes: 59,
    }),
    deadline: time({
      days: 30,
      hours: 23,
      minutes: 59,
    }),
    fromYear: yearValues.find(({ value }) => value === 1),
    toYear: yearValues.find(({ value }) => value === 5),
    jobType: jobTypes.find(({ value }) => value === 'summer_job'),
    workplaces: [],
  },
  isNew: true,
});

const mapDispatchToProps = {
  submitJoblisting: createJoblisting,
  fetchCompanyContacts,
  push,
};
export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps),
)(JoblistingEditor);
