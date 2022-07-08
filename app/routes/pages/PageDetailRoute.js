// @flow
import type { Node } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import {
  fetchAllMemberships,
  fetchAllWithType,
  fetchGroup,
} from 'app/actions/GroupActions';
import {
  fetchAll as fetchAllPages,
  fetchPage,
  updatePage,
} from 'app/actions/PageActions';
import { GroupTypeCommittee } from 'app/models';
import {
  selectCommitteeForPages,
  selectFlatpageForPages,
  selectGroupsForHierarchy,
  selectInfoPageForPages,
  selectNotFoundpageForPages,
  selectPageHierarchy,
  selectPagesForHierarchy,
} from 'app/reducers/pages';
import HTTPError from 'app/routes/errors/HTTPError';
import type { Thunk } from 'app/types';
import prepare from 'app/utils/prepare';
import LandingPage from './components/LandingPage';
import PageDetail, {
  FlatpageRenderer,
  GroupRenderer,
} from './components/PageDetail';

const sections: {
  [section: string]: {
    title: string,
    section: string,
    pageSelector: any,
    hierarchySectionSelector: any,
    PageRenderer: (any) => Node,
    fetchAll?: () => Thunk<*>,
    fetchItemActions: Array<((number) => Thunk<*>) | ((string) => Thunk<*>)>,
  },
} = {
  generelt: {
    title: 'Generelt',
    section: 'generelt',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('generelt'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  bedrifter: {
    title: 'Bedrifter',
    section: 'bedrifter',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('bedrifter'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  arrangementer: {
    title: 'Arrangementer',
    section: 'arrangementer',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('arrangementer'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectGroupsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType(GroupTypeCommittee),
    fetchItemActions: [
      fetchGroup,
      (groupId: number) => fetchAllMemberships(groupId, true),
    ],
  },
  grupper: {
    title: 'Grupper',
    section: 'grupper',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('grupper'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  personvern: {
    title: 'Personvern',
    section: 'personvern',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('personvern'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage],
  },
  'info-om-abakus': {
    title: 'Info om Abakus',
    section: 'info-om-abakus',
    pageSelector: selectInfoPageForPages,
    hierarchySectionSelector: () => ({ title: 'hehe', items: [] }),
    PageRenderer: LandingPage,
    fetchItemActions: [],
  },
};

const getSection = (sectionName) =>
  sections[sectionName] || {
    pageSelector: selectNotFoundpageForPages,
    PageRenderer: HTTPError,
    fetchItemActions: [],
  };

const loadData = async (props, dispatch) => {
  const { fetchItemActions } = getSection(props.match.params.section);
  const { pageSlug } = props.match.params;

  // Only handle flatpages when user isn't authenticated
  if (!props.loggedIn) {
    return Promise.all(
      fetchItemActions
        .map((action) => dispatch(action(pageSlug)))
        .concat(dispatch(fetchAllPages()))
    );
  }
  const itemActions = [];

  for (let i = 0; i < fetchItemActions.length; i++) {
    itemActions[i] = await dispatch(fetchItemActions[i](pageSlug));
  }
  return Promise.all(
    Object.keys(sections)
      .map((key) => sections[key].fetchAll)
      .filter(Boolean)
      .map((fetch) => dispatch(fetch()))
      .concat(itemActions)
  );
};

const mapStateToProps = (state, props) => {
  const { section, pageSlug } = props.match.params;

  const pageHierarchy = selectPageHierarchy(state, { sections });
  const { pageSelector, PageRenderer } = getSection(section);

  const { selectedPage, selectedPageInfo } = pageSelector(state, { pageSlug });
  return {
    selectedPage,
    selectedPageInfo,
    PageRenderer,
    pageHierarchy,
    pageSlug,
    currentUrl: props.location.pathname,
  };
};

const mapDispatchToProps = { updatePage };

export default compose(
  prepare(loadData, ['match.params.pageSlug']),
  connect(mapStateToProps, mapDispatchToProps)
)(PageDetail);
