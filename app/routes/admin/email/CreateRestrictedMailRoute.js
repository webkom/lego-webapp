// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import RestrictedMailEditor from './components/RestrictedMailEditor';
import { createRestrictedMail } from 'app/actions/RestrictedMailActions';
import { push } from 'connected-react-router';

const mapDispatchToProps = { mutateFunction: createRestrictedMail, push };

export default compose(
  connect(
    null,
    mapDispatchToProps
  )
)(RestrictedMailEditor);
