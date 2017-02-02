// @flow
import moment from 'moment';
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import CreateJoblisting from 'app/routes/joblistings/components/CreateJoblisting';

const mapDispatchToProps = { createJoblisting };

connect(
  null,
  mapDispatchToProps
)(CreateJoblisting);
