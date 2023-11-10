import { push } from 'connected-react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createEmailList } from 'app/actions/EmailListActions';
import EmailListEditor from './components/EmailListEditor';

const mapDispatchToProps = {
  mutateFunction: createEmailList,
  push,
};

const mapStateToProps = () => ({
  initialValues: {
    requireInternalAddress: true,
  },
});

export default compose(connect(mapStateToProps, mapDispatchToProps))(
  EmailListEditor,
);
