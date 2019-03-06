// @flow
import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import type { Thunk } from 'app/types';
import { fetchPage, updatePage, fetchAll } from 'app/actions/PageActions';
import { fetchAllMemberships } from 'app/actions/GroupActions';
import { fetchAllWithType, fetchGroup } from 'app/actions/GroupActions';
import PageDetail, {
  FlatpageRenderer,
  GroupRenderer
} from './components/PageDetail';
import LandingPage from './components/LandingPage';
import {
  selectPagesForHierarchy,
  selectGroupsForHierarchy,
  selectPageHierarchy,
  selectCommitteeForPages,
  selectFlatpageForPages,
  selectNotFoundpageForPages,
  selectInfoPageForPages
} from 'app/reducers/pages';
import HTTPError from 'app/routes/errors/HTTPError';

const sections: {
  [section: string]: {
    title: string,
    section: string,
    pageSelector: any,
    hierarchySectionSelector: any,
    PageRenderer: any => React.Node,
    fetchAll?: () => Thunk<*>,
    fetchItemActions: Array<(number => Thunk<*>) | (string => Thunk<*>)>
  }
} = {
  generelt: {
    title: 'Generelt',
    section: 'generelt',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('generelt'),
    PageRenderer: FlatpageRenderer,
    fetchAll: fetchAll,
    fetchItemActions: [fetchPage]
  },
  bedrifter: {
    title: 'Bedrifter',
    section: 'bedrifter',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('bedrifter'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage]
  },
  arrangementer: {
    title: 'Arrangementer',
    section: 'arrangementer',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('arrangementer'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage]
  },
  komiteer: {
    title: 'Komiteer',
    section: 'komiteer',
    pageSelector: selectCommitteeForPages,
    hierarchySectionSelector: selectGroupsForHierarchy,
    PageRenderer: GroupRenderer,
    fetchAll: () => fetchAllWithType('komite'),
    fetchItemActions: [fetchGroup, fetchAllMemberships]
  },
  grupper: {
    title: 'Grupper',
    section: 'grupper',
    pageSelector: selectFlatpageForPages,
    hierarchySectionSelector: selectPagesForHierarchy('grupper'),
    PageRenderer: FlatpageRenderer,
    fetchItemActions: [fetchPage]
  },
  'info-om-abakus': {
    title: 'Info om Abakus',
    section: 'info-om-abakus',
    pageSelector: selectInfoPageForPages,
    hierarchySectionSelector: () => ({ title: 'hehe', items: [] }),
    PageRenderer: LandingPage,
    fetchItemActions: []
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
        .concat(dispatch(fetchAll()))
    );
  }

  return Promise.all(
    Object.keys(sections)
      .map(key => sections[key].fetchAll)
      .filter(Boolean)
      .map(fetch => dispatch(fetch()))
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
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PageDetail);
