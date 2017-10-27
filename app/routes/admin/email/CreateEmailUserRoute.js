// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import EmailUserEditor from './components/EmailUserEditor';
import { createEmailUser } from 'app/actions/EmailUserActions';
import { push } from 'react-router-redux';

const mapDispatchToProps = { mutateFunction: createEmailUser, push };

export default compose(connect(null, mapDispatchToProps))(EmailUserEditor);
