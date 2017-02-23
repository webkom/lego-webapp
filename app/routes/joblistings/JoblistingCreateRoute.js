// @flow
import { connect } from 'react-redux';
import { createJoblisting } from 'app/actions/JoblistingActions';
import JoblistingEditor from 'app/routes/joblistings/components/JoblistingEditor';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';

const mapDispatchToProps = { handleSubmitCallback: createJoblisting };

export default connect(null, mapDispatchToProps)(JoblistingEditor);
