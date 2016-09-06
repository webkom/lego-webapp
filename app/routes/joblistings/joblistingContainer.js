import { connect } from 'react-redux';
import { fetchAll } from 'app/actions/JoblistingActions';
import JoblistingsPage from './components/joblistingsPage';

function mapStateToProps(state, ownProps) {
  const joblistings = state.joblistings.items
    .map((id) => state.entities.joblistings[id]);

  return {
    joblistings
  };
}

const mapDispatchToProps = { fetchAll };

export default connect(mapStateToProps, mapDispatchToProps)(JoblistingsPage);
