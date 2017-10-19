import { compose } from 'redux';
import { connect } from 'react-redux';
import { dispatched } from '@webkom/react-prepare';
import { search } from 'app/actions/SearchActions';
import SearchPage from './components/SearchPage';
import { push } from 'react-router-redux';
import { debounce } from 'lodash';
import { selectResult } from 'app/reducers/search';

const loadData = (props, dispatch) => {
  const query = props.location.query.q;
  if (query) {
    dispatch(search(query));
  }
};

const mapStateToProps = (state, props) => {
  const results = selectResult(state);

  return {
    location: props.location,
    searching: state.search.searching,
    results
  };
};

const mapDispatchToProps = dispatch => ({
  onQueryChanged: debounce(query => {
    dispatch(push(`/search?q=${query}`));
    if (query) {
      dispatch(search(query));
    }
  }, 300)
});

export default compose(
  dispatched(loadData, {
    componentWillReceiveProps: false
  }),
  connect(mapStateToProps, mapDispatchToProps)
)(SearchPage);
