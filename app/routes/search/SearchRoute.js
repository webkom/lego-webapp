import { compose } from 'redux';
import { connect } from 'react-redux';
import { search } from 'app/actions/SearchActions';
import SearchPage from './components/SearchPage';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';
import fetchOnUpdate from 'app/utils/fetchOnUpdate';
import { selectResult } from 'app/reducers/search';

function loadData(params, props) {
  const { query } = props.location;
  props.search(query.q);
}

const mapStateToProps = (state, props) => {
  const { query } = props.location;
  const results = selectResult(state);
  return {
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
  fetchOnUpdate(['loggedIn'], loadData)
)(SearchPage);
