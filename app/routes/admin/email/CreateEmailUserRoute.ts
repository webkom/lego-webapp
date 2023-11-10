import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createEmailUser } from 'app/actions/EmailUserActions';
import EmailUserEditor from './components/EmailUserEditor';

const mapDispatchToProps = {
  mutateFunction: createEmailUser,
  push,
};

const mapStateToProps = () => ({
  initialValues: {
    internalEmailEnabled: true,
  },
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  EmailUserEditor,
);
