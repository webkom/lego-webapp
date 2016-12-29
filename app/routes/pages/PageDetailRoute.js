import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchHierarchy, fetchPage } from 'app/actions/PageActions';
import PageDetail from './components/PageDetail';
import { selectHierarchyBySlug, selectPageBySlug } from 'app/reducers/pages';

function loadData({ pageSlug }, props) {
  props.fetchPage(pageSlug);
  if (!props.hierarchy[pageSlug]) {
    props.fetchHierarchy(pageSlug);
  }
}

function mapStateToProps(state, props) {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  const pageHierarchy = selectHierarchyBySlug(state, { pageSlug });
  return {
    page,
    pageSlug,
    pageHierarchy,
    hierarchy: state.pages.hierarchy
  };
}

const mapDispatchToProps = { fetchHierarchy, fetchPage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['pageSlug', 'loggedIn'], loadData),
)(PageDetail);
