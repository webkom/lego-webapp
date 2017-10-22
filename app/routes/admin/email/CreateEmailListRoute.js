// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailListEditor from './components/EmailListEditor';
import { createEmailList } from 'app/actions/emailListActions';
import { push } from 'react-router-redux';

const mapDispatchToProps = { mutateFunction: createEmailList, push };

export default compose(connect(null, mapDispatchToProps))(EmailListEditor);
