import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { debounce } from 'lodash';
import qs from 'qs';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate } from 'react-router-dom';
import { search } from 'app/actions/SearchActions';
import SearchPage from 'app/components/Search/SearchPage';
import { selectResult } from 'app/reducers/search';
import { useAppDispatch, useAppSelector } from 'app/store/hooks';

const SearchPageWrapper = () => {
  const results = useAppSelector((state) => selectResult(state));

  const location = useLocation();
  const query = qs.parse(location.search, {
    ignoreQueryPrefix: true,
  }).q;

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchSearchResults',
    () => query && dispatch(search(query)),
    [query],
  );

  const navigate = useNavigate();

  const handleSelect = (result) => {
    navigate(result.link);
  };

  const onQueryChanged = debounce((query) => {
    navigate(`/search?q=${query}`);
  }, 300);

  const title = 'Avansert søk';

  return (
    <Page title={title}>
      <Helmet title={title} />
      <SearchPage
        results={results}
        handleSelect={handleSelect}
        onQueryChanged={onQueryChanged}
      />
    </Page>
  );
};

export default SearchPageWrapper;
