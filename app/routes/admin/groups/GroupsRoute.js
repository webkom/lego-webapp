// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import GroupPage from './components/GroupPage';
import { fetchAll } from 'app/actions/GroupActions';
import { selectGroups } from 'app/reducers/groups';

const mapStateToProps = state => ({
  groups: selectGroups(state)
});

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) => dispatch(fetchAll()), {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(GroupPage);
