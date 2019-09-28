import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import prepare from 'app/utils/prepare';
import { Content } from 'app/components/Content';
import { search } from 'app/actions/SearchActions';
import SearchPage from 'app/components/Search/SearchPage';
import { push } from 'connected-react-router';
import { debounce } from 'lodash';
import { selectResult } from 'app/reducers/search';
import qs from 'qs';

const loadData = (props, dispatch) => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true }).q;
  if (query) {
    dispatch(search(query));
  }
};

const mapStateToProps = (state, props) => {
  const results = selectResult(state);
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true }).q;

  return {
    query: query,
    searching: state.search.searching,
    results
  };
};

const mapDispatchToProps = dispatch => ({
  handleSelect: result => dispatch(push(result.link)),
  onQueryChanged: debounce(query => {
    dispatch(push(`/search?q=${query}`));
  }, 300)
});

function SearchPageWrapper(props) {
  return (
    <Content>
      <SearchPage {...props} />
    </Content>
  );
}

export default compose(
  prepare(loadData, ['location.search']),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(SearchPageWrapper);
