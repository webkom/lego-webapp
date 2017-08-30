import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { fetchAll, fetchPage, updatePage } from 'app/actions/PageActions';
import PageDetail from './components/PageDetail';
import {
  selectSiblings,
  selectParent,
  selectPageBySlug
} from 'app/reducers/pages';

const loadData = (props, dispatch) => {
  if (!props.pages || !props.page) {
    // We only need to fetch the title list once
    // to show the page hierarchy:
    return dispatch(fetchAll()).then(() =>
      dispatch(fetchPage(props.params.pageSlug))
    );
  }
  return dispatch(fetchPage(props.params.pageSlug));
};

const mapStateToProps = (state, props) => {
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
};

const mapDispatchToProps = { fetchAll, fetchPage, updatePage };

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadData, {
    componentWillReceiveProps: false
  })
)(PageDetail);
