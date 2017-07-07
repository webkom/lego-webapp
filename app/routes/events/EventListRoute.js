// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import { selectEvents } from 'app/reducers/events';
import moment from 'moment';

const mapStateToProps = (state, ownProps) => {
  const icalToken =
    state.auth && state.users.byId[state.auth.username]
      ? state.users.byId[state.auth.username].icalToken
      : null;
  const actionGrant = state => state.events.actionGrant;
  return {
    ...createStructuredSelector({
      events: selectEvents,
      actionGrant: actionGrant
    })(state, ownProps),
    icalToken
  };
};

export default compose(
  dispatched((props, dispatch) =>
    dispatch(fetchAll({ dateAfter: moment().format('YYYY-MM-DD') }))
  ),
  connect(mapStateToProps)
)(EventList);
