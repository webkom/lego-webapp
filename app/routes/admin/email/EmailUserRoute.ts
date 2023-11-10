import { get } from 'lodash';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { editEmailUser, fetchEmailUser } from 'app/actions/EmailUserActions';
import { selectEmailUserById } from 'app/reducers/emailUsers';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EmailUserEditor from './components/EmailUserEditor';

const mapStateToProps = (state, { match: { params } }) => {
  const { emailUserId } = params;
  const emailUser = selectEmailUserById(state, {
    emailUserId,
  });
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

const mapDispatchToProps = {
  fetchEmailUser,
  mutateFunction: editEmailUser,
};

export default compose(
  withPreparedDispatch(
    'fetchEmailUser',
    (props, dispatch) =>
      dispatch(fetchEmailUser(props.match.params.emailUserId)),
    (props) => [props.match.params.emailUserId],
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['emailUser.user.id']),
)(EmailUserEditor);
