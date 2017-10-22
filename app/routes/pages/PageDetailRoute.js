// @flow

import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { fetchPage, updatePage, fetchAll } from 'app/actions/PageActions';
import { fetchMemberships } from 'app/actions/GroupActions';
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
import { selectMembershipsForGroup } from 'app/reducers/memberships';
import HTTPError from 'app/routes/errors/HTTPError';

const loadData = (props, dispatch) => {
  const section = sections[props.params.section];
  const { pageSlug } = props.params;

  // Only handle flatpages when user isn't authenticated
  if (!props.loggedIn) {
    return Promise.all([
      dispatch(section.fetchAll()),
      ...section.fetchItemActions.map(action => dispatch(action(pageSlug)))
    ]);
  }

  return Promise.all([
    ...Object.keys(sections).map(key => dispatch(sections[key].fetchAll())),
    ...(section &&
      section.fetchItemActions.map(action => dispatch(action(pageSlug))))
  ]);
};

const mapStateToPropsFlatpages = (state, props) => {
  const { pageSlug } = props.params;
  const selectedPage = selectPageBySlug(state, { pageSlug });

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

  const memberships = selectMembershipsForGroup(state, {
    groupId: Number(pageSlug)
  });

  const selectedPageInfo = group && {
    actionGrant: group.actionGrant || [],
    title: group.name,
    editUrl: `/admin/groups/${group.id}/settings`
  };
  return {
    selectedPage: group && { ...group, memberships },
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
    fetchItemActions: [fetchPage]
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    mapStateToPropsForSection: mapStateToPropsComitee,
    hierarchySectionSelector: selectGroupsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType('komite'),
    fetchItemActions: [fetchGroup, fetchMemberships]
  }
};
const mapStateToProps = (state, props) => {
  const { section, pageSlug } = props.params;

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
    pageSlug,
    currentUrl: props.location.pathname
  };
};

const mapDispatchToProps = { updatePage };

export default compose(
  prepare(loadData, ['params.pageSlug']),
  connect(mapStateToProps, mapDispatchToProps)
)(PageDetail);
