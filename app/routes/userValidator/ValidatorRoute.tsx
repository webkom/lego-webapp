import { debounce } from 'lodash';
import qs from 'qs';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { push } from 'redux-first-history';
import { autocomplete } from 'app/actions/SearchActions';
import { fetchUser } from 'app/actions/UserActions';
import { Content } from 'app/components/Content';
import Validator from 'app/components/UserValidator';
import type { User } from 'app/models';
import { selectAutocompleteRedux as selectAutocomplete } from 'app/reducers/search';
import type { UserSearchResult } from 'app/reducers/search';
import withPreparedDispatch from 'app/utils/withPreparedDispatch';
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

const mapDispatchToProps = (dispatch, { location }) => {
  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  return {
    clearSearch: () =>
      dispatch(push(`/validator?${qs.stringify({ ...search, q: '' })}`)),

    handleSelect: async (result: UserSearchResult): Promise<User> => {
      const fetchRes = await dispatch(
        fetchUser(result.username, { propagateError: false })
      );

      return Object.values(fetchRes.payload?.entities?.users)[0] as User;
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
