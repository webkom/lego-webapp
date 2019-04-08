// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailUserEditor from './components/EmailUserEditor';
import { createEmailUser } from 'app/actions/EmailUserActions';
import { push } from 'connected-react-router';

const mapDispatchToProps = { mutateFunction: createEmailUser, push };

const mapStateToProps = () => ({
  initialValues: {
    internalEmailEnabled: true
  }
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EmailUserEditor);
