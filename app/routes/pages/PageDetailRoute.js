// @flow
import type { Node } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import type { Thunk } from 'app/types';
import {
  fetchPage,
  updatePage,
  fetchAll as fetchAllPages,
} from 'app/actions/PageActions';
import {
  fetchAllMemberships,
  fetchAllWithType,
  fetchGroup,
} from 'app/actions/GroupActions';

import PageDetail, {
  FlatpageRenderer,
  GroupRenderer,
} from './components/PageDetail';
import LandingPage from './components/LandingPage';
import { GroupTypeCommittee, GroupTypeBoard } from 'app/models';
import {
  selectPagesForHierarchy,
  selectCommitteeForHierarchy,
  selectBoardsForHierarchy,
  selectPageHierarchy,
  selectCommitteeForPages,
  selectFlatpageForPages,
  selectNotFoundpageForPages,
  selectInfoPageForPages,
} from 'app/reducers/pages';
import HTTPError from 'app/routes/errors/HTTPError';

type Entry = {
  title: string,
  section: string,
  pageSelector: any,
  hierarchySectionSelector: any,
  PageRenderer: (any) => Node,
  fetchAll?: () => Thunk<*>,
  fetchItemActions: Array<((number) => Thunk<*>) | ((string) => Thunk<*>)>,
};

const sections: {|
  [section: string]: Entry,
|} = {
  generelt: {
    title: 'Generelt',
    section: 'generelt',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('generelt'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  organisasjon: {
    title: 'Organisasjon',
    section: 'organisasjon',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('organisasjon'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
    fetchItemActions: [fetchPage],
  },
  styrer: {
    title: 'Styrer',
    section: 'styrer',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectBoardsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType(GroupTypeBoard),
    fetchItemActions: [
      fetchGroup,
      (groupId: number) => fetchAllMemberships(groupId, true),
    ],
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
    hierarchySectionSelector: selectCommitteeForHierarchy,
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
  utnevnelser: {
    title: 'Utnevnelser',
    section: 'utnevnelser',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('utnevnelser'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAllPages,
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

export const categoryOptions = Object.keys(sections)
  .map<Entry>((key) => sections[key])
  .filter((entry: Entry) => entry.pageSelector === selectFlatpageForPages)
  .map<{ value: string, label: string }>((entry: Entry) => ({
    value: entry.section,
    label: entry.title,
  }));

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

  // Avoid dispatching duplicate actions
  const uniqueFetches = [
    ...new Set(
      Object.keys(sections)
        .map((key) => sections[key].fetchAll)
        .filter(Boolean)
    ),
  ];

  return Promise.all(
    uniqueFetches.map((fetch) => dispatch(fetch())).concat(itemActions)
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
