import { compose } from 'redux';
import { connect } from 'react-redux';
<<<<<<< HEAD
import { fetchAll, fetchPage, updatePage } from 'app/actions/PageActions';
=======
import { dispatched } from 'react-prepare';
import { fetchPage, updatePage } from 'app/actions/PageActions';
>>>>>>> More work
import PageDetail from './components/PageDetail';
import prepare from 'app/utils/prepare';
import {
  selectSiblings,
  selectParent,
  selectPageBySlug,
  selectChildren
} from 'app/reducers/pages';

const loadData = (props, dispatch) => {
  if (!props.pages || !props.page) {
    // We only need to fetch the title list once
    // to show the page hierarchy:
    return dispatch(fetchAll()).then(() => dispatch(fetchPage(props.pageSlug)));
  }
  return dispatch(fetchPage(props.pageSlug));
};

const mapStateToProps = (state, props) => {
  const { pageSlug } = props.params;
  const page = selectPageBySlug(state, { pageSlug });
  const siblings = selectSiblings(state, { parentPk: page.parent });
  const children = selectChildren(state, { parentPk: page.pk });
  const parent = selectParent(state, { parentPk: page.parent });
  return {
    page,
    pageSlug,
    siblings,
    parent,
    children,
    pages: state.pages.byId
  };
};

const mapDispatchToProps = { updatePage };

export default compose(
  prepare(({ params: { pageSlug } }, dispatch) =>
    dispatch(fetchPage(pageSlug))
  ),
  connect(mapStateToProps, mapDispatchToProps)
)(PageDetail);
