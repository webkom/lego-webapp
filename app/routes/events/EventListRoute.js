// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import { selectSortedEvents } from 'app/reducers/events';
import moment from 'moment';

const mapStateToProps = (state, ownProps) => {
  const user = ownProps.currentUser;
  const icalToken = user ? user.icalToken : null;
  const actionGrant = state => state.events.actionGrant;
  return {
    ...createStructuredSelector({
      events: selectSortedEvents,
      actionGrant
    })(state, ownProps),
    icalToken
  };
};

export default compose(
  dispatched((props, dispatch) =>
    dispatch(fetchAll({ dateAfter: moment().format('YYYY-MM-DD') })), {
      componentWillReceiveProps: false
    }
  ),
  connect(mapStateToProps)
)(EventList);
