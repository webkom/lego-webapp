import { connect } from 'react-redux';
import { compose } from 'redux';
import { addSurvey, deleteSurvey } from '../../actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'react-router-redux';

const mapStateToProps = (state, props) => {
  return {
    initialValues: {
      title: '',
      active_from: '',
      questions: '',
      submissions: '',
      event: '',
      template_type: ''
    }
  };
};

const mapDispatchToProps = {
  submitFunction: addSurvey,
  push,
  deleteSurvey
};

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(SurveyEditor);
