// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { dispatched } from 'react-prepare';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import { selectEvents } from 'app/reducers/events';
import moment from 'moment';

const actionGrant = state => state.events.actionGrant;
const mapStateToProps = createStructuredSelector({
  events: selectEvents,
  actionGrant: actionGrant
});

export default compose(
  dispatched((props, dispatch) =>
    dispatch(fetchAll({ dateAfter: moment().format('YYYY-MM-DD') }))),
  connect(mapStateToProps)
)(EventList);
