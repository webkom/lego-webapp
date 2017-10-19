// @flow
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapStateToProps = () => ({
  initialValues: {
    text: '',
    description: '',
    fromYear: 1,
    toYear: 5,
    jobType: 'summer_job'
  },
  isNew: true
});

const mapDispatchToProps = {
  submitJoblisting: createJoblisting
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(JoblistingEditor);
