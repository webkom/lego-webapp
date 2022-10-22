import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupPage from './components/GroupPage';
import { fetchAll } from 'app/actions/GroupActions';
import { selectGroups } from 'app/reducers/groups';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => {
  const groups = selectGroups(state);
  const { match } = props;
  return {
    groups,
    match,
  };
};

export default compose(
  withPreparedDispatch('fetchGroups', (props, dispatch) =>
    dispatch(fetchAll())
  ),
  connect(mapStateToProps, {})
)(GroupPage);
