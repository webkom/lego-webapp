// @flow
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';

function mapDispatchToProps(dispatch) {
  return {
    submitJoblisting: joblisting => dispatch(createJoblisting(joblisting))
  };
}

function mapStateToProps(state, props) {
  return {
    initialValues: {
      text: '<p></p>',
      description: '<p></p>',
      fromYear: 1,
      toYear: 5,
      jobType: 'summer_job'
    },
    isNew: true
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(JoblistingEditor);
