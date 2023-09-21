import { connect } from 'react-redux';
import { compose } from 'redux';
import { sendContactMessage } from 'app/actions/ContactActions';
import { fetchAllWithType } from 'app/actions/GroupActions';
import { addToast } from 'app/actions/ToastActions';
import { GroupType } from 'app/models';
import { selectGroupsWithType } from 'app/reducers/groups';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import Contact from './components/Contact';

const groupType = GroupType.Committee;

const mapStateToProps = (state, props) => {
  const groups = selectGroupsWithType(state, {
    groupType,
  });
  return {
    groups,
  };
};

const mapDispatchToProps = {
  sendContactMessage,
  addToast,
};
export default compose(
  withPreparedDispatch('fetchContact', (_, dispatch) =>
    dispatch(fetchAllWithType(groupType))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(Contact);
