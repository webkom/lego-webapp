import { Page } from '@webkom/lego-bricks';
import { usePreparedEffect } from '@webkom/react-prepare';
import { debounce } from 'lodash';
import { Helmet } from 'react-helmet-async';
import SearchPage from '~/components/Search/SearchPage';
import { search } from '~/redux/actions/SearchActions';
import { useAppDispatch, useAppSelector } from '~/redux/hooks';
import { selectResult } from '~/redux/slices/search';
import { usePageContext } from 'vike-react/usePageContext';
import { navigate } from 'vike/client/router';

const SearchPageWrapper = () => {
  const pageContext = usePageContext();
  const results = useAppSelector((state) => selectResult(state));

  const query = pageContext.urlParsed.search.q;

  const dispatch = useAppDispatch();

  usePreparedEffect(
    'fetchSearchResults',
    () => query && dispatch(search(query)),
    [query],
  );

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
