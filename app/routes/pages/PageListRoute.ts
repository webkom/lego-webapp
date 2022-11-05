import { compose } from 'redux';
import { connect } from 'react-redux';
import PageList from './components/PageList';
import { fetchAll } from 'app/actions/PageActions';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';

const mapStateToProps = (state, props) => ({
  pages: state.pages.byId,
});

const mapDispatchToProps = {
  fetchAll,
};
export default compose(
  withPreparedDispatch('fetchPageList', (props, dispatch) =>
    dispatch(fetchAll())
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(PageList);
