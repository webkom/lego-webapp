import { connect } from 'react-redux';
import { compose } from 'redux';
import { fetchEmailList, editEmailList } from 'app/actions/EmailListActions';
import { selectEmailListById } from 'app/reducers/emailLists';
import { ROLES, type RoleType } from 'app/utils/constants';
import loadingIndicator from 'app/utils/loadingIndicator';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import EmailListEditor from './components/EmailListEditor';

const mapStateToProps = (state, { match: { params } }) => {
  const emailList = selectEmailListById(state, params.emailListId);
  return {
    emailList,
    emailListId: params.emailListId,
    initialValues: {
      ...emailList,
      // $FlowFixMe
      groups: (emailList.groups || []).filter(Boolean).map((groups) => ({
        label: groups.name,
        value: groups.id,
      })),
      // $FlowFixMe
      groupRoles: (emailList.groupRoles || []).map((groupRoles: RoleType) => ({
        label: ROLES[groupRoles],
        value: groupRoles,
      })),
      // $FlowFixMe
      users: (emailList.users || []).filter(Boolean).map((user) => ({
        label: user.fullName,
        value: user.id,
      })),
      // $FlowFixMe
      additionalEmails: (emailList.additionalEmails || []).map(
        (additionalEmail) => ({
          label: additionalEmail,
          value: additionalEmail,
        })
      ),
    },
  };
};

const mapDispatchToProps = {
  fetchEmailList,
  mutateFunction: editEmailList,
};

export default compose(
  withPreparedDispatch(
    'fetchEmailList',
    (props, dispatch) =>
      dispatch(fetchEmailList(props.match.params.emailListId)),
    (props) => [props.match.params.emailListId]
  ),
  connect(mapStateToProps, mapDispatchToProps),
  loadingIndicator(['emailList.name'])
)(EmailListEditor);
