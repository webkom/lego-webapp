import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createRestrictedMail } from 'app/actions/RestrictedMailActions';
import RestrictedMailEditor from './components/RestrictedMailEditor';

const mapDispatchToProps = {
  mutateFunction: createRestrictedMail,
  push,
};
export default compose(connect(null, mapDispatchToProps))(RestrictedMailEditor);
