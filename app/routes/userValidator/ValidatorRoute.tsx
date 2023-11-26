import { debounce } from 'lodash';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { autocomplete } from 'app/actions/SearchActions';
import { addToast } from 'app/actions/ToastActions';
import { fetchUser } from 'app/actions/UserActions';
import { Content } from 'app/components/Content';
import Validator from 'app/components/UserValidator';
import { selectAutocompleteRedux as selectAutocomplete } from 'app/reducers/search';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
import type { UserSearchResult } from 'app/reducers/search';
import type { AppDispatch } from 'app/store/createStore';
import type { ComponentProps } from 'react';

const searchTypes = ['users.user'];

const loadData = async (props, dispatch): Promise<void> => {
  const query = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).q;

  if (query && typeof query === 'string') {
    await dispatch(autocomplete(query, searchTypes));
  }
};

const mapStateToProps = (state, props) => {
  const results = qs.parse(props.location.search, {
    ignoreQueryPrefix: true,
  }).q
    ? selectAutocomplete(state)
    : [];
  return {
    location: props.location,
    searching: state.search.searching,
    results,
  };
};

const mapDispatchToProps = (dispatch: AppDispatch, { location }) => {
  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  return {
    addToast: (args: Parameters<typeof addToast>) => dispatch(addToast(args)),
    clearSearch: () =>
      dispatch(push(`/validator?${qs.stringify({ ...search, q: '' })}`)),

    handleSelect: async (result: UserSearchResult) => {
      return dispatch(fetchUser(result.username, { propagateError: false }));
    },

    onQueryChanged: debounce((query) => {
      dispatch(push(`/validator?${qs.stringify({ ...search, q: query })}`));

      if (query) {
        dispatch(autocomplete(query, searchTypes));
      }
    }, 300),
  };
};

const WrappedValidator = (props: ComponentProps<typeof Validator>) => (
  <Content>
    <Validator {...props} validateAbakusGroup />
  </Content>
);

export default compose(
  withPreparedDispatch('fetchValidator', loadData),
  connect(mapStateToProps, mapDispatchToProps)
)(WrappedValidator);
