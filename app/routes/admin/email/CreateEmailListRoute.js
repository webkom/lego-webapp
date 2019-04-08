// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailListEditor from './components/EmailListEditor';
import { createEmailList } from 'app/actions/EmailListActions';
import { push } from 'connected-react-router';

const mapDispatchToProps = { mutateFunction: createEmailList, push };

const mapStateToProps = () => ({
  initialValues: { requireInternalAddress: true }
});

export default compose(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(EmailListEditor);
