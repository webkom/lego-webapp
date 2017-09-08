import { compose } from 'redux';
import { connect } from 'react-redux';
import { createInterestGroup } from 'app/actions/InterestGroupActions';
import InterestGroupCreate from './components/InterestGroupCreate';
import { LoginPage } from 'app/components/LoginForm';
import replaceUnlessLoggedIn from 'app/utils/replaceUnlessLoggedIn';

const mapDispatchToProps = { createInterestGroup };

const mapStateToProps = (state, props) => ({
  initialValues: {
    descriptionLong: '<p></p>'
  }
});

export default compose(
  replaceUnlessLoggedIn(LoginPage),
  connect(mapStateToProps, mapDispatchToProps)
)(InterestGroupCreate);
