// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import GroupPage from './components/GroupPage';
import { fetchAll } from 'app/actions/GroupActions';
import { selectGroups } from 'app/reducers/groups';
import prepare from 'app/utils/prepare';

const mapStateToProps = (state, props) => {
  const groups = selectGroups(state);
  const { match } = props;
  return {
    groups,
    match
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(GroupPage);
