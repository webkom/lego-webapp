import { connect } from 'react-redux';
import { compose } from 'redux';
import { addSurvey, deleteSurvey } from '../../actions/SurveyActions';
import SurveyEditor from './components/SurveyEditor';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';
import { push } from 'react-router-redux';
import moment from 'moment-timezone';

const time = (hours, minutes) =>
  moment()
    .startOf('day')
    .add({ hours, minutes })
    .toISOString();

const mapStateToProps = (state, props) => {
  return {
    initialValues: {
      title: '',
      isClone: 'false',
      activeFrom: time(12, 0),
      questions: [],
      event: ''
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
