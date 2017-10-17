import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { fetchPage, updatePage, fetchAll } from 'app/actions/PageActions';
import { fetchAllWithType, fetchGroup } from 'app/actions/GroupActions';
import PageDetail, {
  FlatpageRenderer,
  GroupRenderer
} from './components/PageDetail';
import {
  selectPageBySlug,
  selectPagesForHierarchy,
  selectGroupsForHierarchy
} from 'app/reducers/pages';
import { selectGroup } from 'app/reducers/groups';
import HTTPError from 'app/routes/errors/HTTPError';

const loadPage = ({ params: { section, pageSlug } }, dispatch) =>
  sections[section].fetchItem(pageSlug);

const isValidSection = sectionKey => !!sections[sectionKey];

const loadData = (props, dispatch) => {
  Object.keys(sections).forEach(key => dispatch(sections[key].fetchAll()));

  const { section } = props.params;
  return isValidSection(section) && dispatch(loadPage(props, dispatch));
};

const mapStateToPropsFlatpages = (state, props) => {
  const { pageSlug } = props.params;
  const selectedPage: PageEntity = selectPageBySlug(state, { pageSlug });

  const selectedPageInfo = {
    actionGrant: selectedPage.actionGrant || [],
    title: selectedPage.title,
    editUrl: `/pages/info/${selectedPage.slug}/edit`
  };
  return {
    selectedPage,
    selectedPageInfo
  };
};
const mapStateToPropsSectionNotFound = (state, props, pageHierarchy) => ({
  selectedPageInfo: {
    title: 'Finner ikke det du leter etter',
    actionGrant: []
  },
  selectedPage: {},
  PageRenderer: HTTPError,
  pageHierarchy
});

const mapStateToPropsComitee = (state, props) => {
  const { pageSlug } = props.params;
  const group: Object = selectGroup(state, { groupId: pageSlug });

  const selectedPageInfo = group && {
    actionGrant: group.actionGrant || [],
    title: group.name,
    editUrl: `/admin/groups/${group.id}/settings`
  };
  return {
    selectedPage: group,
    selectedPageInfo
  };
};

const sections = {
  info: {
    title: 'Informasjon',
    section: 'info',
    mapStateToPropsForSection: mapStateToPropsFlatpages,
    hierarchySectionSelector: selectPagesForHierarchy,
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAll,
    fetchItem: fetchPage
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    mapStateToPropsForSection: mapStateToPropsComitee,
    hierarchySectionSelector: selectGroupsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType('komite'),
    fetchItem: fetchGroup
  }
};
const mapStateToProps = (state, props) => {
  const { section } = props.params;

  const pageHierarchy = Object.keys(sections).map(sectionKey =>
    sections[sectionKey].hierarchySectionSelector(state, {
      title: sections[sectionKey].title
    })
  );

  if (!sections[section]) {
    return mapStateToPropsSectionNotFound(state, props, pageHierarchy);
  }
  const { mapStateToPropsForSection, PageRenderer } = sections[section];
  return {
    ...mapStateToPropsForSection(state, props),
    PageRenderer,
    pageHierarchy,
    currentUrl: props.location.pathname
  };
};

const mapDispatchToProps = { updatePage };

export default compose(
  dispatched(loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(PageDetail);
