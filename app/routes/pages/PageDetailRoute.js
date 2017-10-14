import { compose } from 'redux';
import { connect } from 'react-redux';
import { fetchAll, fetchPage, updatePage } from 'app/actions/PageActions';
import { dispatched } from 'react-prepare';
import { fetchPage, updatePage } from 'app/actions/PageActions';
import PageDetail from './components/PageDetail';
import prepare from 'app/utils/prepare';
import { fetchPage, updatePage, fetchAll } from 'app/actions/PageActions';
import { fetchAllWithType, fetchGroup } from 'app/actions/GroupActions';
import PageDetail, {
  FlatpageRenderer,
  GroupRenderer
} from './components/PageDetail';
import {
  selectPages,
  selectPageBySlug,
  selectPagesForHierarchy,
  selectGroupsForHierarchy
} from 'app/reducers/pages';
import { selectGroup } from 'app/reducers/groups';

const loadData = (props, dispatch) => {
  if (!props.pages || !props.page) {
    // We only need to fetch the title list once
    // to show the page hierarchy:
    return dispatch(fetchAll()).then(() => dispatch(fetchPage(props.pageSlug)));
  }
  return dispatch(fetchPage(props.pageSlug));
};

const mapStateToProps = (state, props) => {
const loadPage = ({ params: { section, pageSlug } }, dispatch) => {
  switch (section) {
    case 'komiteer':
      return fetchGroup(pageSlug);
    case 'info':
    default:
      return fetchPage(pageSlug);
  }
};
const loadData = (props, dispatch) =>
  dispatch(loadPage(props, dispatch))
    .then(() => dispatch(fetchAll()))
    .then(() => dispatch(fetchAllWithType('annen')));

const mapStateToPropsFlatpages = (state, props) => {
  const { pageSlug } = props.params;
  const selectedPage: PageEntity = selectPageBySlug(state, { pageSlug });

  const selectedPageInfo = {
    actionGrant: selectedPage.actionGrant || [],
    title: selectedPage.title,
    editUrl: `/pages/${selectedPage.slug}/edit`
  };
  const PageRenderer = FlatpageRenderer;
  return {
    selectedPage,
    selectedPageInfo,
    PageRenderer
  };
};

const mapStateToPropsComitee = (state, props) => {
  const { pageSlug } = props.params;
  const group: Object = selectGroup(state, { groupId: pageSlug });

  const selectedPageInfo = group && {
    actionGrant: group.actionGrant || [],
    title: group.name,
    editUrl: `/admin/groups/${group.id}/settings`
  };
  const PageRenderer = GroupRenderer;
  return {
    selectedPage: group,
    selectedPageInfo,
    PageRenderer
  };
};

const mapStateToPropsForSection = (state, props, section) => {
  switch (section) {
    case 'komiteer':
      return mapStateToPropsComitee(state, props);
    case 'info':
    default:
      return mapStateToPropsFlatpages(state, props);
  }
};
const mapStateToProps = (state, props) => {
  const { section } = props.params;

  const pageHierarchy = [
    selectPagesForHierarchy(state, { title: 'Informasjon' }),
    selectGroupsForHierarchy(state, { title: 'Komiteer' })
  ];
  const currentUrl = props.location.pathname;

  return {
    ...mapStateToPropsForSection(state, props, section),
    pageHierarchy,
    currentUrl
  };
};

const mapDispatchToProps = { updatePage };

export default compose(
  prepare(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(PageDetail);
