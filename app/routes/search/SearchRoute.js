import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from 'react-prepare';
import { search } from 'app/actions/SearchActions';
import SearchPage from './components/SearchPage';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';
import { selectResult } from 'app/reducers/search';

const loadData = ({ results = [], query, prevQuery }, dispatch) => {
  if (results.length === 0 || query !== prevQuery) {
    return dispatch(search(query));
  }
};

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const results = selectResult(state);
  return {
    prevQuery: state.search.query,
    query: query.q,
    searching: state.search.searching,
    results
  };
};

const mapDispatchToProps = dispatch => ({
  onQueryChanged: debounce(query => dispatch(search(query)), 300),
  push: uri => dispatch(push(uri)),
  search: query => dispatch(search(query))
});

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  dispatched(loadData, {
    componentWillReceiveProps: false
  })
)(SearchPage);
