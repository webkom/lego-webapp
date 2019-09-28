// @flow
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { debounce } from 'lodash';
import prepare from 'app/utils/prepare';
import { autocomplete } from 'app/actions/SearchActions';
import { selectAutocompleteRedux as selectAutocomplete } from 'app/reducers/search';
import { Content } from 'app/components/Content';
import Validator from 'app/components/UserValidator';
import qs from 'qs';

const searchTypes = ['users.user'];

const loadData = async (props, dispatch) => {
  const query = qs.parse(props.location.search, { ignoreQueryPrefix: true }).q;
  if (query) {
    await dispatch(autocomplete(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const results = qs.parse(props.location.search, { ignoreQueryPrefix: true }).q
    ? selectAutocomplete(state)
    : [];
  return {
    location: props.location,
    searching: state.search.searching,
    results
  };
};

const mapDispatchToProps = (dispatch, { eventId }) => {
  const url = `/validator?q=`;
  return {
    clearSearch: () => dispatch(push(url)),
    handleSelect: () => Promise.resolve(),
    onQueryChanged: debounce(query => {
      dispatch(push(url + query));
      if (query) {
        dispatch(autocomplete(query, searchTypes));
      }
    }, 300)
  };
};

const WrappedValidator = props => (
  <Content>
    <Validator {...props} />
  </Content>
);

export default compose(
  prepare(loadData),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(WrappedValidator);
