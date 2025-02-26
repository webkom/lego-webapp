import { Page } from '@webkom/lego-bricks';
import { debounce } from 'lodash';
import qs from 'qs';
import { useLocation, useNavigate } from 'react-router';
import Validator from '~/components/UserValidator';
import { autocomplete } from '~/redux/actions/SearchActions';
import { fetchUser } from '~/redux/actions/UserActions';
import { useAppDispatch } from '~/redux/hooks';
import type { SearchUser } from '~/redux/models/User';
import type { UserSearchResult } from '~/redux/slices/search';

const searchTypes = ['users.user'];

const WrappedValidator = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const clearSearch = () =>
    navigate(`/validator?${qs.stringify({ ...search, q: '' })}`);

  const handleSelect = async (
    result: UserSearchResult,
  ): Promise<SearchUser> => {
    const fetchRes = await dispatch(
      fetchUser(result.username, { propagateError: false }),
    );

    return Object.values(fetchRes.payload?.entities?.users)[0] as SearchUser;
  };

  const search = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  });

  const onQueryChanged = debounce((query) => {
    navigate(`/validator?${qs.stringify({ ...search, q: query })}`);

    if (query) {
      dispatch(autocomplete(query, searchTypes));
    }
  }, 300);

  return (
    <Page title="Verifiser Abakus-medlemmer">
      <Validator
        clearSearch={clearSearch}
        handleSelect={handleSelect}
        onQueryChanged={onQueryChanged}
        validateAbakusGroup
      />
    </Page>
  );
};

export default WrappedValidator;
