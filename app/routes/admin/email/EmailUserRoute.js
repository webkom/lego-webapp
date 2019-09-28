// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailUserEditor from './components/EmailUserEditor';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import { get } from 'lodash';
import { selectEmailUserById } from 'app/reducers/emailUsers';
import { editEmailUser, fetchEmailUser } from 'app/actions/EmailUserActions';

const mapStateToProps = (state, { match: { params } }) => {
  const { emailUserId } = params;
  const emailUser = selectEmailUserById(state, { emailUserId });

  return {
    emailUser,
    emailUserId,
    fetching: state.emailUsers.fetching,
    initialValues: {
      ...emailUser,
      user: {
        label: get(emailUser, 'user.fullName', ''),
        value: get(emailUser, 'user.id', '')
      }
    }
  };
};

const mapDispatchToProps = { fetchEmailUser, mutateFunction: editEmailUser };

const loadData = ({ match: { params } }, dispatch) =>
  dispatch(fetchEmailUser(params.emailUserId));

export default compose(
  prepare(loadData, ['match.params.emailUserId']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  ),
  loadingIndicator(['emailUser.user.id'])
)(EmailUserEditor);
