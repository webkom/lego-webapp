import { compose } from 'redux';
import { connect } from 'react-redux';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { fetchAll, fetchPage } from 'app/actions/PageActions';
import PageDetail from './components/PageDetail';
import { selectSiblings, selectParent, selectPageBySlug } from 'app/reducers/pages';

function loadData({ pageSlug }, props) {
  props.fetchPage(pageSlug);
  // We only need to fetch the title list once
  // to show the page hierarchy:
  if (!props.pages[pageSlug]) {
    props.fetchAll(pageSlug);
  }
}

function mapStateToProps(state, props) {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  const siblings = selectSiblings(state, { parentPk: page.parent });
  const parent = selectParent(state, { parentPk: page.parent });
  return {
    page,
    pageSlug,
    siblings,
    parent,
    pages: state.pages.byId
  };
}

const mapDispatchToProps = { fetchAll, fetchPage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  fetchOnUpdate(['pageSlug', 'loggedIn'], loadData),
)(PageDetail);
