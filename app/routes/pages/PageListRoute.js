import { compose } from 'redux';
import { connect } from 'react-redux';
import PageList from './components/PageList';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchAll } from 'app/actions/PageActions';

function loadData(params, props) {
  props.fetchAll();
}

function mapStateToProps(state, props) {
  return {
    pages: state.pages.byId
  };
}

const mapDispatchToProps = { fetchAll };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['loggedIn'], loadData)
)(PageList);
