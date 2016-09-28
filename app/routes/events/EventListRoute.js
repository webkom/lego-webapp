// @flow

import moment from 'moment';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/EventActions';
import EventList from './components/EventList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state, ownProps) {
  const {
    year = moment().year(),
    month = moment().month() + 1
  } = ownProps.location.query;

  return {
    year,
    month
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(EventList);
