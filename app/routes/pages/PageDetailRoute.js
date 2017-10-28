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
  selectPagesForHierarchy,
  selectGroupsForHierarchy,
  selectPageHierarchy,
  selectCommitteeForPages,
  selectFlatpageForPages,
  selectNotFoundpageForPages
} from 'app/reducers/pages';
import HTTPError from 'app/routes/errors/HTTPError';

const sections = {
  info: {
    title: 'Informasjon',
    section: 'info',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy,
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAll,
    fetchItemActions: [fetchPage]
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectGroupsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType('komite'),
    fetchItemActions: [fetchGroup, fetchMemberships]
  }
};

const getSection = sectionName =>
  sections[sectionName] || {
    pageSelector: selectNotFoundpageForPages,
    PageRenderer: HTTPError,
    fetchItemActions: []
  };

const loadData = (props, dispatch) => {
  const { fetchItemActions } = getSection(props.params.section);
  const { pageSlug } = props.params;

  // Only handle flatpages when user isn't authenticated
  if (!props.loggedIn) {
    return Promise.all(
      fetchItemActions
        .map(action => dispatch(action(pageSlug)))
        .concat(dispatch(sections.info.fetchAll()))
    );
  }

  return Promise.all(
    Object.keys(sections)
      .map(key => dispatch(sections[key].fetchAll()))
      .concat(fetchItemActions.map(action => dispatch(action(pageSlug))))
  );
};

const mapStateToProps = (state, props) => {
  const { section, pageSlug } = props.params;

  const pageHierarchy = selectPageHierarchy(state, { sections });
  const { pageSelector, PageRenderer } = getSection(section);

  const { selectedPage, selectedPageInfo } = pageSelector(state, { pageSlug });
  return {
    selectedPage,
    selectedPageInfo,
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
