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
  const nextPage = state => state.events.next;
  return {
    ...createStructuredSelector({
      events: selectEvents,
      actionGrant,
      nextPage
    })(state, ownProps),
    icalToken
  };
};

const mapDispatchToProps = { fetchAll };

export default compose(
  dispatched((props, dispatch) =>
    dispatch(fetchAll({ dateAfter: moment().format('YYYY-MM-DD') }))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(EventList);
