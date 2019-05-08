import { compose } from 'redux';
import { connect } from 'react-redux';
import PageList from './components/PageList';
import prepare from 'app/utils/prepare';
import { fetchAll } from 'app/actions/PageActions';

const mapStateToProps = (state, props) => ({
  pages: state.pages.byId
});

const mapDispatchToProps = { fetchAll };

export default compose(
  prepare((props, dispatch) => dispatch(fetchAll())),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PageList);
