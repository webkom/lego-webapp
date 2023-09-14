import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
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
  EmailListEditor
);
