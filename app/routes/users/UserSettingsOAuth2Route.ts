import { compose } from 'redux';
import { connect } from 'react-redux';
import UserSettingsOAuth2 from './components/UserSettingsOAuth2';
import {
  fetchOAuth2Applications,
  fetchOAuth2Grants,
  deleteOAuth2Grant,
} from 'app/actions/OAuth2Actions';
import {
  selectOAuth2Applications,
  selectOAuth2Grants,
} from 'app/reducers/oauth2';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state) => {
  return {
    applications: selectOAuth2Applications(state),
    grants: selectOAuth2Grants(state),
    actionGrant: state.oauth2Applications.actionGrant,
  };
};

const mapDispatchToProps = {
  fetchOAuth2Applications,
  fetchOAuth2Grants,
  deleteOAuth2Grant,
};
export default compose(
  withPreparedDispatch('fetchUserSettingsOAuth2', (props, dispatch) =>
    Promise.all([
      dispatch(fetchOAuth2Applications()),
      dispatch(fetchOAuth2Grants()),
    ])
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(UserSettingsOAuth2);
