// @flow

import { connect } from 'react-redux';
import { get } from 'lodash';
import { compose } from 'redux';

import { editEmailUser, fetchEmailUser } from 'app/actions/EmailUserActions';
import { selectEmailUserById } from 'app/reducers/emailUsers';
import loadingIndicator from 'app/utils/loadingIndicator';
import prepare from 'app/utils/prepare';
import EmailUserEditor from './components/EmailUserEditor';

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
        value: get(emailUser, 'user.id', ''),
      },
    },
  };
};

const mapDispatchToProps = { fetchEmailUser, mutateFunction: editEmailUser };

const loadData = ({ match: { params } }, dispatch) =>
  dispatch(fetchEmailUser(params.emailUserId));

export default compose(
  prepare(loadData, ['match.params.emailUserId']),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['emailUser.user.id'])
)(EmailUserEditor);
