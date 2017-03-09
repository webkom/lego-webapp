// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectEvents } from 'app/reducers/events';
import moment from 'moment';

function loadData(params, props) {
  return props.fetchAll({ dateAfter: moment().format('YYYY-MM-DD') });
}

const mapStateToProps = createStructuredSelector({
  events: selectEvents
});

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(EventList);
