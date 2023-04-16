import { debounce } from 'lodash';
import { useState } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { autocomplete } from 'app/actions/SearchActions';
import type { SearchResult } from 'app/reducers/search';
import { useAppDispatch } from 'app/store/hooks';
import type { ComponentType } from 'react';

type InjectedProps = {
  options: SearchResult[];
  onSearch: (query: string) => void;
  fetching: boolean;
};

type Props = {
  filter?: string[];
};

const useAutocomplete = ({
  retainFailedQuery = false,
  filter,
}: {
  retainFailedQuery?: boolean;
  filter?: string[];
}) => {
  const [options, setOptions] = useState<SearchResult[]>([]);
  const [fetching, setFetching] = useState(false);

  const dispatch = useAppDispatch();

  const handleSearch = async (query: string): Promise<void> => {
    setFetching(true);

    try {
      const result = await dispatch(autocomplete(query, filter));

      // Set the result to the response result
      let finalResult: SearchResult[] = result;

      // Retain a query with no match
      if (retainFailedQuery && result.length === 0) {
        finalResult = [
          {
            title: query,
            label: query,
          },
        ];
      }

      setOptions(finalResult);
      setFetching(false);
    } catch (e) {
      setFetching(false);
    }
  };

  const debouncedHandleSearch = debounce(handleSearch, 100);

  return { options, fetching, onSearch: debouncedHandleSearch };
};

function withAutocomplete<P extends InjectedProps & Props>({
  WrappedComponent,
  retainFailedQuery = false,
}: {
  WrappedComponent: ComponentType<P>;
  retainFailedQuery?: boolean;
}) {
  const Component = (props: Omit<P, keyof InjectedProps>) => {
    const { options, fetching, onSearch } = useAutocomplete({
      retainFailedQuery,
      filter: props.filter,
    });

    return (
      <WrappedComponent
        {...(props as P)}
        options={options}
        fetching={fetching}
        onSearch={onSearch}
        filterOption={() => true}
      />
    );
  };
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Unknown';
  Component.displayName = `Autocomplete(${displayName})`;
  return Component;
}

const mapDispatchToProps = {
  autocomplete,
};

export default compose(connect(null, mapDispatchToProps), withAutocomplete);
