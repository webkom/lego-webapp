import { connect } from 'react-redux';
import { compose } from 'redux';
import {
  fetchAllMemberships,
  fetchAllWithType,
  fetchGroup,
} from 'app/actions/GroupActions';
import {
  fetchPage,
  updatePage,
  fetchAll as fetchAllPages,
} from 'app/actions/PageActions';
import { GroupType } from 'app/models';
import {
  selectPagesForHierarchy,
  selectCommitteeForHierarchy,
  selectRevueForHierarchy,
  selectBoardsForHierarchy,
  selectPageHierarchy,
  selectCommitteeForPages,
  selectFlatpageForPages,
  selectNotFoundpageForPages,
  selectInfoPageForPages,
} from 'app/reducers/pages';
import HTTPError from 'app/routes/errors/HTTPError';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import LandingPage from './components/LandingPage';
import PageDetail, {
  FlatpageRenderer,
  GroupRenderer,
} from './components/PageDetail';
import type { PageRenderer } from './components/PageDetail';
import type { Thunk } from 'app/types';

type Entry = {
  title: string;
  section: string;
  pageSelector: any;
  hierarchySectionSelector: any;
  PageRenderer: PageRenderer;
  fetchAll?: () => Thunk<any>;
  fetchItemActions: Array<
    ((arg0: number) => Thunk<any>) | ((arg0: string) => Thunk<any>)
  >;
};
const sections: Record<string, Entry> = {
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
    fetchAll: () => fetchAllWithType(GroupType.Board),
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
    fetchAll: () => fetchAllWithType(GroupType.Committee),
    fetchItemActions: [
      fetchGroup,
      (groupId: number) => fetchAllMemberships(groupId, true),
    ],
  },
  revy: {
    title: 'Revy',
    section: 'revy',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectRevueForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType(GroupType.Revue),
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
    hierarchySectionSelector: () => ({
      title: 'hehe',
      items: [],
    }),
    PageRenderer: LandingPage,
    fetchItemActions: [],
  },
};

export const categoryOptions = Object.keys(sections)
  .map<Entry>((key) => sections[key])
  .filter((entry: Entry) => entry.pageSelector === selectFlatpageForPages)
  .map<{
    value: string;
    label: string;
  }>((entry: Entry) => ({
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

  // Only handle flatpages and groups when user isn't authenticated
  if (!props.loggedIn) {
    const actionsToDispatch = fetchItemActions
      .filter((action) => !action.toString().includes('fetchAllMemberships'))
      .map((action) => dispatch(action(pageSlug)));

    return Promise.all([...actionsToDispatch, dispatch(fetchAllPages())]);
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
  const pageHierarchy = selectPageHierarchy(state, {
    sections,
  });
  const { pageSelector, PageRenderer } = getSection(section);
  const { selectedPage, selectedPageInfo } = pageSelector(state, {
    pageSlug,
  });
  return {
    selectedPage,
    selectedPageInfo,
    PageRenderer,
    pageHierarchy,
    pageSlug,
    currentUrl: props.location.pathname,
  };
};

const mapDispatchToProps = {
  updatePage,
};
export default compose(
  withPreparedDispatch('fetchPageDetail', loadData, (props) => [
    props.match.params.pageSlug,
  ]),
  connect(mapStateToProps, mapDispatchToProps)
)(PageDetail);
