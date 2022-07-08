import { connect } from 'react-redux';
import { compose } from 'redux';

import { fetchAll } from 'app/actions/PageActions';
import prepare from 'app/utils/prepare';
import PageList from './components/PageList';

const mapStateToProps = (state, props) => ({
  pages: state.pages.byId,
});

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(mapStateToProps, mapDispatchToProps)
)(PageList);
