import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { createRestrictedMail } from 'app/actions/RestrictedMailActions';
import RestrictedMailEditor from './components/RestrictedMailEditor';

const mapDispatchToProps = {
  mutateFunction: createRestrictedMail,
  push,
};
export default compose(connect(null, mapDispatchToProps))(RestrictedMailEditor);
